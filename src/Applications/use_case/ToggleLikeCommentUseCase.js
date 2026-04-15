class ToggleLikeCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { threadId, commentId, userId } = useCasePayload;

    // 1. Verifikasi thread ada
    await this._threadRepository.verifyThreadExists(threadId);
    
    // 2. Verifikasi comment ada
    await this._commentRepository.verifyCommentExists(commentId);

    // 3. Cek apakah sudah di-like
    const isLiked = await this._commentRepository.checkLikeExists(commentId, userId);

    if (isLiked) {
      await this._commentRepository.deleteLike(commentId, userId);
    } else {
      await this._commentRepository.addLike(commentId, userId);
    }
  }
}

module.exports = ToggleLikeCommentUseCase;