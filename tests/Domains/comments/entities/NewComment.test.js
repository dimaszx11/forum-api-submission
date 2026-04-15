const NewComment = require('../../../../src/Domains/comments/entities/NewComment');

describe('NewComment entity', () => {
  it('should throw error when payload does not contain needed property', () => {
    const payload = { content: 'sebuah comment', owner: 'user-123' };
    expect(() => new NewComment(payload)).toThrow('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data type specification', () => {
    const payload = { content: true, threadId: 'thread-123', owner: 'user-123' };
    expect(() => new NewComment(payload)).toThrow('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create new comment object correctly', () => {
    const payload = { content: 'sebuah comment', threadId: 'thread-123', owner: 'user-123' };
    const newComment = new NewComment(payload);
    expect(newComment).toEqual(payload);
  });
});
