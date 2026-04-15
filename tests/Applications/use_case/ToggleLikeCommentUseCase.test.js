const CommentRepository = require('../../../src/Domains/comments/CommentRepository');
const ThreadRepository = require('../../../src/Domains/threads/ThreadRepository');
const ToggleLikeCommentUseCase = require('../../../src/Applications/use_case/ToggleLikeCommentUseCase');

describe('ToggleLikeCommentUseCase', () => {
  it('should orchestrating the add like action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-123',
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadExists = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentExists = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkLikeExists = jest.fn()
      .mockImplementation(() => Promise.resolve(false)); // Ceritanya belum di-like
    mockCommentRepository.addLike = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const toggleLikeCommentUseCase = new ToggleLikeCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await toggleLikeCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadExists).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentExists).toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockCommentRepository.checkLikeExists).toHaveBeenCalledWith(useCasePayload.commentId, useCasePayload.userId);
    expect(mockCommentRepository.addLike).toHaveBeenCalledWith(useCasePayload.commentId, useCasePayload.userId);
  });

  it('should orchestrating the delete like action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadExists = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentExists = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkLikeExists = jest.fn()
      .mockImplementation(() => Promise.resolve(true)); // Ceritanya SUDAH di-like
    
    // PERBAIKAN: addLike harus tetap di-mocking meskipun tidak dipanggil
    mockCommentRepository.addLike = jest.fn()
      .mockImplementation(() => Promise.resolve());
      
    mockCommentRepository.deleteLike = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const toggleLikeCommentUseCase = new ToggleLikeCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await toggleLikeCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadExists).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentExists).toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockCommentRepository.checkLikeExists).toHaveBeenCalledWith(useCasePayload.commentId, useCasePayload.userId);
    expect(mockCommentRepository.deleteLike).toHaveBeenCalledWith(useCasePayload.commentId, useCasePayload.userId);
    expect(mockCommentRepository.addLike).not.toHaveBeenCalled();
  });
});