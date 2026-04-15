class AuthenticationRepository {
  async addToken(token) {
    throw new Error('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  // Tambahkan atau pastikan method ini ada
 async checkAvailabilityToken(token) {
  throw new Error('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
}

  // Jika Use Case kamu memanggil verifyToken, biarkan ini ada
  async verifyToken(token) {
    throw new Error('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async deleteToken(token) {
    throw new Error('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = AuthenticationRepository;