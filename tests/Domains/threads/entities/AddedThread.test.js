const AddedThread = require('../../../../src/Domains/threads/entities/AddedThread');

describe('AddedThread entity', () => {
  it('should throw error when payload does not contain needed property', () => {
    const payload = { id: 'thread-123', title: 'sebuah thread' };
    expect(() => new AddedThread(payload)).toThrow('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data type specification', () => {
    const payload = { id: 'thread-123', title: 'sebuah thread', owner: {} };
    expect(() => new AddedThread(payload)).toThrow('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create added thread object correctly', () => {
    const payload = { id: 'thread-123', title: 'sebuah thread', owner: 'user-123' };
    const addedThread = new AddedThread(payload);
    expect(addedThread).toEqual(payload);
  });
});
