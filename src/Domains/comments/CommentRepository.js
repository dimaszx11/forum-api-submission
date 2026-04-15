class CommentRepository {
  async addComment(newComment) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyCommentExists(commentId) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async isCommentExist(commentId) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyCommentOwner(commentId, owner) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async deleteComment(commentId) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getCommentsByThreadId(threadId) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
  // Tambahkan method ini di dalam class CommentRepository
async checkLikeExists(commentId, userId) {
  throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
}

async addLike(commentId, userId) {
  throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
}

async deleteLike(commentId, userId) {
  throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
}

async getLikeCount(commentId) {
  throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
}
}

module.exports = CommentRepository;