const jwt = require('jsonwebtoken');
const AuthenticationTokenManager = require('../../Applications/security/AuthenticationTokenManager');
// GANTI AuthenticationError menjadi InvariantError
const InvariantError = require('../../Commons/exceptions/InvariantError');

class JwtTokenManager extends AuthenticationTokenManager {
async createAccessToken(payload) {
    // Bungkus payload (string id) ke dalam object { id }
    return jwt.sign({ id: payload }, process.env.ACCESS_TOKEN_KEY, { 
      expiresIn: Number(process.env.ACCESS_TOKEN_AGE || 3600) 
    });
  }

  async createRefreshToken(payload) {
    // Lakukan hal yang sama di sini agar konsisten
    return jwt.sign({ id: payload }, process.env.REFRESH_TOKEN_KEY);
  }

  async verifyRefreshToken(token) {
    try {
      jwt.verify(token, process.env.REFRESH_TOKEN_KEY);
    } catch (error) {
      // UBAH KE InvariantError agar dapet status 400
      throw new InvariantError('refresh token tidak valid');
    }
  }

  async decodePayload(token) {
    // Gunakan try-catch atau biarkan melempar error yang ditangkap translator
    try {
      return jwt.verify(token, process.env.REFRESH_TOKEN_KEY);
    } catch (error) {
      throw new InvariantError('refresh token tidak valid');
    }
  }

  async verifyAccessToken(token) {
    try {
      return jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
    } catch (error) {
      // Untuk Access Token (biasanya di Middleware), 401 sebenarnya boleh.
      // Tapi jika reviewer minta 400 di semua validasi, ganti ke InvariantError.
      // Namun saran saya, fokus ke Refresh Token dulu:
      throw new InvariantError('access token tidak valid');
    }
  }
}

module.exports = JwtTokenManager;