class ThreadsHandler {
  constructor(addThreadUseCase, getThreadDetailUseCase) {
    this._addThreadUseCase = addThreadUseCase;
    this._getThreadDetailUseCase = getThreadDetailUseCase;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadDetailHandler = this.getThreadDetailHandler.bind(this);
  }

  async postThreadHandler(req, res, next) {
    try {
      const addedThread = await this._addThreadUseCase.execute(req.body, req.user.id);
      res.status(201).json({
        status: 'success',
        data: { addedThread },
      });
    } catch (error) {
      next(error);
    }
  }

  async getThreadDetailHandler(req, res, next) {
    try {
      const thread = await this._getThreadDetailUseCase.execute(req.params.threadId);
      res.status(200).json({
        status: 'success',
        data: { thread },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ThreadsHandler;