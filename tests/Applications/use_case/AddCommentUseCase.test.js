const AddCommentUseCase = require('../../../src/Applications/use_case/AddCommentUseCase');
const AddedComment = require('../../../src/Domains/comments/entities/AddedComment');
const NewComment = require('../../../src/Domains/comments/entities/NewComment');

describe('AddCommentUseCase', () => {
  it('should orchestrate the add comment action correctly', async () => {
    // 1. Arrange
    const useCasePayload = { threadId: 'thread-123', content: 'sebuah comment' };
    const owner = 'user-123';

    /**
     * Pisahkan objek yang dikembalikan oleh mock repository
     */
    const mockAddedComment = new AddedComment({
      id: 'comment-123',
      content: 'sebuah comment',
      owner: 'user-123',
    });

    const threadRepository = {
      verifyThreadExists: jest.fn(() => Promise.resolve()),
    };

    const commentRepository = {
      // Masukkan objek mock tadi ke sini
      addComment: jest.fn(() => Promise.resolve(mockAddedComment)),
    };

    /**
     * Buat objek expected secara terpisah untuk validasi akhir
     */
    const expectedAddedComment = new AddedComment({
      id: 'comment-123',
      content: 'sebuah comment',
      owner: 'user-123',
    });

    // 2. Action
    const addCommentUseCase = new AddCommentUseCase({ threadRepository, commentRepository });
    const addedComment = await addCommentUseCase.execute(useCasePayload, owner);

    // 3. Assert
    expect(addedComment).toStrictEqual(expectedAddedComment);
    expect(threadRepository.verifyThreadExists).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(commentRepository.addComment).toHaveBeenCalledWith(new NewComment({
      content: useCasePayload.content,
      threadId: useCasePayload.threadId,
      owner,
    }));
  });
});