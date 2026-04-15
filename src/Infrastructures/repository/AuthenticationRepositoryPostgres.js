const AuthenticationRepository = require('../../Domains/authentications/AuthenticationRepository');
const InvariantError = require('../../Commons/exceptions/InvariantError');

class AuthenticationRepositoryPostgres extends AuthenticationRepository {
  constructor(pool) {
    super();
    this._pool = pool;
  }

  async addToken(token) {
    const query = {
      text: 'INSERT INTO authentications(token) VALUES($1)',
      values: [token],
    };
    await this._pool.query(query);
  }

  // Ubah nama dari verifyToken menjadi checkAvailabilityToken agar sinkron dengan Test
  async checkAvailabilityToken(token) {
    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      throw new InvariantError('refresh token tidak ditemukan di database');
    }
  }

  // Opsional: Hapus checkIfTokenIsRegistered jika sudah tidak dipanggil lagi di Test
  // Agar kode lebih bersih (Clean)

  async deleteToken(token) {
    const query = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token],
    };
    await this._pool.query(query);
  }
}

module.exports = AuthenticationRepositoryPostgres;