class AuthenticationsHandler {
  constructor(loginUserUseCase, refreshAuthenticationUseCase, logoutUserUseCase) {
    this._loginUserUseCase = loginUserUseCase;
    this._refreshAuthenticationUseCase = refreshAuthenticationUseCase;
    this._logoutUserUseCase = logoutUserUseCase;
    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
  }

async postAuthenticationHandler(req, res, next) {
    try {
      const { accessToken, refreshToken } = await this._loginUserUseCase.execute(req.body);
      res.status(201).json({
        status: 'success',
        data: {
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

async putAuthenticationHandler(req, res, next) {
    try {
      const accessToken = await this._refreshAuthenticationUseCase.execute(req.body);
      res.status(200).json({
        status: 'success',
        data: {
          accessToken, // Ini akan membungkus string token ke dalam properti accessToken
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteAuthenticationHandler(req, res, next) {
    try {
      await this._logoutUserUseCase.execute(req.body);
      res.status(200).json({ status: 'success' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthenticationsHandler;
