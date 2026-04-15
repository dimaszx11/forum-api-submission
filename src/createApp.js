require('dotenv').config();
const express = require('express');
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const pool = require('./Infrastructures/database/postgres/pool');
const DomainErrorTranslator = require('./Commons/exceptions/DomainErrorTranslator');
const ClientError = require('./Commons/exceptions/ClientError');
const BcryptPasswordHash = require('./Infrastructures/security/BcryptPasswordHash');
const JwtTokenManager = require('./Infrastructures/security/JwtTokenManager');
const UserRepositoryPostgres = require('./Infrastructures/repository/UserRepositoryPostgres');
const AuthenticationRepositoryPostgres = require('./Infrastructures/repository/AuthenticationRepositoryPostgres');
const ThreadRepositoryPostgres = require('./Infrastructures/repository/ThreadRepositoryPostgres');
const CommentRepositoryPostgres = require('./Infrastructures/repository/CommentRepositoryPostgres');

const AddUserUseCase = require('./Applications/use_case/AddUserUseCase');
const LoginUserUseCase = require('./Applications/use_case/LoginUserUseCase');
const RefreshAuthenticationUseCase = require('./Applications/use_case/RefreshAuthenticationUseCase');
const LogoutUserUseCase = require('./Applications/use_case/LogoutUserUseCase');

const UsersHandler = require('./Infrastructures/http/api/users/handler');
const usersRoutes = require('./Infrastructures/http/api/users/routes');
const AuthenticationsHandler = require('./Infrastructures/http/api/authentications/handler');
const authenticationsRoutes = require('./Infrastructures/http/api/authentications/routes');

const threadsPlugin = require('./Infrastructures/http/api/threads');
const commentsPlugin = require('./Infrastructures/http/api/comments');

const authMiddleware = require('./Infrastructures/http/middleware/authMiddleware');

const createApp = () => {
  const app = express();
  app.use(express.json());

  const passwordHash = new BcryptPasswordHash(bcrypt);
  const jwtTokenManager = new JwtTokenManager();
  const userRepository = new UserRepositoryPostgres(pool, nanoid);
  const authenticationRepository = new AuthenticationRepositoryPostgres(pool);
  const threadRepository = new ThreadRepositoryPostgres(pool, nanoid);
  const commentRepository = new CommentRepositoryPostgres(pool, nanoid);

  const container = {
    threadRepository,
    commentRepository,
  };

  const auth = authMiddleware(jwtTokenManager);

  const usersHandler = new UsersHandler(new AddUserUseCase({ userRepository, passwordHash }));
  const authenticationsHandler = new AuthenticationsHandler(
    new LoginUserUseCase({ userRepository, passwordHash, authenticationTokenManager: jwtTokenManager, authenticationRepository }),
    new RefreshAuthenticationUseCase({ authenticationRepository, authenticationTokenManager: jwtTokenManager }),
    new LogoutUserUseCase({ authenticationRepository }),
  );

  app.use(usersRoutes(usersHandler));
  app.use(authenticationsRoutes(authenticationsHandler));

  app.use(threadsPlugin({ container, auth }));
  app.use(commentsPlugin({ container, auth }));

  // Middleware 404 (Sering merah jika tidak ada test case route ngasal)
  app.use((req, res) => {
    res.status(404).json({
      status: 'fail',
      message: 'resource tidak ditemukan',
    });
  });

  // ERROR HANDLING MIDDLEWARE
  app.use((error, req, res, next) => {
    const translatedError = DomainErrorTranslator.translate(error);

    if (translatedError instanceof ClientError) {
      return res.status(translatedError.statusCode).json({
        status: 'fail',
        message: translatedError.message,
      });
    }

    
    return res.status(500).json({
      status: 'error',
      message: 'terjadi kegagalan pada server kami',
    });
  });

  return app;
};

module.exports = createApp;