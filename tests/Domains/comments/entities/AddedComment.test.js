const AddedComment = require('../../../../src/Domains/comments/entities/AddedComment');

describe('AddedComment entity', () => {
  it('should throw error when payload does not contain needed property', () => {
    const payload = { id: 'comment-123', content: 'sebuah comment' };
    expect(() => new AddedComment(payload)).toThrow('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data type specification', () => {
    const payload = { id: 'comment-123', content: 'sebuah comment', owner: {} };
    expect(() => new AddedComment(payload)).toThrow('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create added comment object correctly', () => {
    const payload = { id: 'comment-123', content: 'sebuah comment', owner: 'user-123' };
    const addedComment = new AddedComment(payload);
    expect(addedComment).toEqual(payload);
  });
});
