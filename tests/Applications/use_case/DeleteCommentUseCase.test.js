const DeleteCommentUseCase = require('../../../src/Applications/use_case/DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrate the delete comment action correctly', async () => {
    const useCasePayload = { threadId: 'thread-123', commentId: 'comment-123' };
    const owner = 'user-123';

    const threadRepository = {
      verifyThreadExists: jest.fn(() => Promise.resolve()),
    };
    const commentRepository = {
      verifyCommentExists: jest.fn(() => Promise.resolve()),
      verifyCommentOwner: jest.fn(() => Promise.resolve()),
      deleteComment: jest.fn(() => Promise.resolve()),
    };

    const deleteCommentUseCase = new DeleteCommentUseCase({ threadRepository, commentRepository });
    await deleteCommentUseCase.execute(useCasePayload, owner);

    expect(threadRepository.verifyThreadExists).toHaveBeenCalledWith('thread-123');
    expect(commentRepository.verifyCommentExists).toHaveBeenCalledWith('comment-123');
    expect(commentRepository.verifyCommentOwner).toHaveBeenCalledWith('comment-123', 'user-123');
    expect(commentRepository.deleteComment).toHaveBeenCalledWith('comment-123');
  });
});
