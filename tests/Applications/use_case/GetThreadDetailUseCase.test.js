const GetThreadDetailUseCase = require('../../../src/Applications/use_case/GetThreadDetailUseCase');

describe('GetThreadDetailUseCase', () => {
  it('should orchestrate the get thread detail action correctly', async () => {
    const threadRepository = {
      verifyThreadExists: jest.fn(() => Promise.resolve()),
      getThreadById: jest.fn(() => Promise.resolve({
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah body',
        date: '2021-08-08T07:19:09.775Z',
        username: 'dicoding',
      })),
    };
    const commentRepository = {
      getCommentsByThreadId: jest.fn(() => Promise.resolve([
        {
          id: 'comment-123',
          username: 'johndoe',
          date: '2021-08-08T07:22:33.555Z',
          content: 'sebuah comment',
          is_delete: false,
        },
        {
          id: 'comment-456',
          username: 'dicoding',
          date: '2021-08-08T07:26:21.338Z',
          content: 'komentar rahasia',
          is_delete: true,
        },
      ])),
    };

    const getThreadDetailUseCase = new GetThreadDetailUseCase({ threadRepository, commentRepository });
    const threadDetail = await getThreadDetailUseCase.execute('thread-123');

    expect(threadRepository.verifyThreadExists).toHaveBeenCalledWith('thread-123');
    expect(threadRepository.getThreadById).toHaveBeenCalledWith('thread-123');
    expect(commentRepository.getCommentsByThreadId).toHaveBeenCalledWith('thread-123');
    expect(threadDetail).toStrictEqual({
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
      comments: [
        {
          id: 'comment-123',
          username: 'johndoe',
          date: '2021-08-08T07:22:33.555Z',
          content: 'sebuah comment',
        },
        {
          id: 'comment-456',
          username: 'dicoding',
          date: '2021-08-08T07:26:21.338Z',
          content: '**komentar telah dihapus**',
        },
      ],
    });
  });
});
