const NewThread = require('../../../../src/Domains/threads/entities/NewThread');

describe('NewThread entity', () => {
  it('should throw error when payload does not contain needed property', () => {
    const payload = { title: 'sebuah thread', owner: 'user-123' };
    expect(() => new NewThread(payload)).toThrow('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data type specification', () => {
    const payload = { title: 'sebuah thread', body: {}, owner: 'user-123' };
    expect(() => new NewThread(payload)).toThrow('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create new thread object correctly', () => {
    const payload = { title: 'sebuah thread', body: 'sebuah body', owner: 'user-123' };
    const newThread = new NewThread(payload);
    expect(newThread).toEqual(payload);
  });
});
