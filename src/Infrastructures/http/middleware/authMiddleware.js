const AuthenticationError = require('../../../Commons/exceptions/AuthenticationError');

const authMiddleware = (jwtTokenManager) => async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    // Baris ini akan memicu 401 'Missing authentication' (Tes sudah ada)
    if (!authHeader) {
      throw new AuthenticationError('Missing authentication');
    }

    const [scheme, token] = authHeader.split(' ');
    
    // Baris ini akan memicu 401 'format autentikasi tidak valid' (Tes sudah ada)
    if (scheme !== 'Bearer' || !token) {
      throw new AuthenticationError('format autentikasi tidak valid');
    }

    // verifyAccessToken akan melempar error asli (seperti 'jwt malformed')
    // jika token tidak valid.
    const payload = await jwtTokenManager.verifyAccessToken(token);
    
    req.user = { id: payload.id, username: payload.username };
    next();
  } catch (error) {
    /**
     * Kita langsung teruskan error ke next(error).
     * Error ini akan ditangkap oleh middleware error di createApp.js,
     * lalu diterjemahkan oleh DomainErrorTranslator menjadi status 401.
     */
    next(error);
  }
};

module.exports = authMiddleware;