const LoginUser = require('../../Domains/users/entities/LoginUser');
const NewAuth = require('../../Domains/authentications/entities/NewAuth');
const AuthenticationError = require('../../Commons/exceptions/AuthenticationError');

class LoginUserUseCase {
  constructor({ userRepository, passwordHash, authenticationTokenManager, authenticationRepository }) {
    this._userRepository = userRepository;
    this._passwordHash = passwordHash;
    this._authenticationTokenManager = authenticationTokenManager;
    this._authenticationRepository = authenticationRepository;
  }

async execute(useCasePayload) {
    // 1. Validasi payload menggunakan Entity (Opsional tapi sangat disarankan di Clean Architecture)
    const { username, password } = new LoginUser(useCasePayload);

    // 2. Ambil password terenkripsi dari database
    const encryptedPassword = await this._userRepository.getPasswordByUsername(username);

    // 3. Bandingkan password (pastikan method-nya sudah 'compare')
    await this._passwordHash.compare(password, encryptedPassword);

    // 4. Ambil ID user berdasarkan username
    // PERBAIKAN: Gunakan variabel 'username' langsung
    const id = await this._userRepository.getIdByUsername(username);

    // 5. Buat Token
    const accessToken = await this._authenticationTokenManager.createAccessToken(id);
    const refreshToken = await this._authenticationTokenManager.createRefreshToken(id);

    const newAuth = new NewAuth({ accessToken, refreshToken });

    // 6. Simpan refresh token ke database
    await this._authenticationRepository.addToken(newAuth.refreshToken);

    return newAuth;
  }
}

module.exports = LoginUserUseCase;