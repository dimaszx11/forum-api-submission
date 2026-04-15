class CommentsHandler {
  constructor(addCommentUseCase, deleteCommentUseCase, toggleLikeCommentUseCase) {
    this._addCommentUseCase = addCommentUseCase;
    this._deleteCommentUseCase = deleteCommentUseCase;
    this._toggleLikeCommentUseCase = toggleLikeCommentUseCase; // Tambahkan ini

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
    this.putLikeCommentHandler = this.putLikeCommentHandler.bind(this); // Bind method baru
  }

  async postCommentHandler(req, res, next) {
    try {
      const addedComment = await this._addCommentUseCase.execute({
        threadId: req.params.threadId,
        content: req.body.content,
      }, req.user.id);
      
      res.status(201).json({
        status: 'success',
        data: { addedComment },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteCommentHandler(req, res, next) {
    try {
      await this._deleteCommentUseCase.execute({
        threadId: req.params.threadId,
        commentId: req.params.commentId,
      }, req.user.id);
      
      res.status(200).json({ status: 'success' });
    } catch (error) {
      next(error);
    }
  }

  // TAMBAHKAN METHOD INI
  async putLikeCommentHandler(req, res, next) {
    try {
      await this._toggleLikeCommentUseCase.execute({
        threadId: req.params.threadId,
        commentId: req.params.commentId,
        userId: req.user.id, // Pastikan req.user.id diisi oleh middleware auth kamu
      });

      res.status(200).json({ status: 'success' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CommentsHandler;