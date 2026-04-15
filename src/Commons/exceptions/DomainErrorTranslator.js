const InvariantError = require('./InvariantError');
const AuthenticationError = require('./AuthenticationError');

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator._directories[error.message] || error;
  },
};

DomainErrorTranslator._directories = {
  // --- Auth Middleware & JWT Errors ---
  'Missing authentication': new AuthenticationError('Missing authentication'),
  'format autentikasi tidak valid': new AuthenticationError('format autentikasi tidak valid'),
  'access token tidak valid': new AuthenticationError('access token tidak valid'),
  'access token expired': new AuthenticationError('access token expired'),
  'jwt malformed': new AuthenticationError('access token tidak valid'),
  'invalid signature': new AuthenticationError('access token tidak valid'),
  'jwt signature is invalid': new AuthenticationError('access token tidak valid'),
  'invalid token': new AuthenticationError('access token tidak valid'),
  'jwt expired': new AuthenticationError('access token expired'),

// --- TAMBAHKAN INI SESUAI PESAN REVIEWER ---
  'REGISTER_USER.PASSWORD_LIMIT_CHAR': new InvariantError('tidak dapat membuat user baru karena karakter password melebihi batas'),
  'LOGIN_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError('tidak dapat login karena username mengandung karakter terlarang'),

  // --- Register User ---
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai'),
  'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas'),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'),
  
  // --- Login User ---
  'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('harus mengirimkan username dan password'),
  'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('username dan password harus string'),
  'LOGIN_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('harus mengirimkan username dan password'),
  'LOGIN_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('username dan password harus string'),
  
  // --- Authentications (Refresh & Logout) ---
  // Ditambahkan 'PAYLOAD_' agar sinkron dengan Use Case yang melempar error 500 tadi
  'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan refresh token'),
  'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
  'REFRESH_AUTHENTICATION_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
  
  'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan refresh token'),
  'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
  'DELETE_AUTHENTICATION_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),

  // --- Threads ---
  'NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada'),
  'NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat thread baru karena tipe data tidak sesuai'),
  
  // --- Comments ---
  'NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat komentar baru karena properti yang dibutuhkan tidak ada'),
  'NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat komentar baru karena tipe data tidak sesuai'),
};

module.exports = DomainErrorTranslator;