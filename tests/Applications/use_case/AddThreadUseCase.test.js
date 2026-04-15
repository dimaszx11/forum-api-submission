const AddThreadUseCase = require('../../../src/Applications/use_case/AddThreadUseCase');
const AddedThread = require('../../../src/Domains/threads/entities/AddedThread');
const NewThread = require('../../../src/Domains/threads/entities/NewThread');

describe('AddThreadUseCase', () => {
  it('should orchestrate the add thread action correctly', async () => {
    // 1. Arrange
    const useCasePayload = { 
      title: 'sebuah thread', 
      body: 'sebuah body' 
    };
    const owner = 'user-123';

    /**
     * Objek yang akan dikembalikan oleh mock repository
     */
    const mockAddedThread = new AddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner,
    });

    const mockThreadRepository = {
      addThread: jest.fn(() => Promise.resolve(mockAddedThread)),
    };

    /**
     * Objek yang kita harapkan sebagai hasil akhir (Assertion)
     */
    const expectedAddedThread = new AddedThread({
      id: 'thread-123',
      title: 'sebuah thread',
      owner: 'user-123',
    });

    // 2. Action
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });
    const addedThread = await addThreadUseCase.execute(useCasePayload, owner);

    // 3. Assert
    expect(addedThread).toStrictEqual(expectedAddedThread);
    expect(mockThreadRepository.addThread).toHaveBeenCalledWith(new NewThread({
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner,
    }));
  });
});