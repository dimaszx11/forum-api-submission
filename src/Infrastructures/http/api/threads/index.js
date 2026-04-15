const ThreadsHandler = require('./handler');
const routes = require('./routes');
const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetThreadDetailUseCase = require('../../../../Applications/use_case/GetThreadDetailUseCase');

module.exports = ({ container, auth }) => {
  const addThreadUseCase = new AddThreadUseCase({ 
    threadRepository: container.threadRepository 
  });
  const getThreadDetailUseCase = new GetThreadDetailUseCase({ 
    threadRepository: container.threadRepository, 
    commentRepository: container.commentRepository 
  });

  const threadsHandler = new ThreadsHandler(addThreadUseCase, getThreadDetailUseCase);
  return routes(threadsHandler, auth);
};