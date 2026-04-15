class UsersHandler {
  constructor(addUserUseCase) {
    this._addUserUseCase = addUserUseCase;
    this.postUserHandler = this.postUserHandler.bind(this);
  }

  async postUserHandler(req, res, next) {
    try {
      const addedUser = await this._addUserUseCase.execute(req.body);
      res.status(201).json({
        status: 'success',
        data: { addedUser },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UsersHandler;
