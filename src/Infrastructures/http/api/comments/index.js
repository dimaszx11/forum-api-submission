const CommentsHandler = require('./handler');
const routes = require('./routes');
const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');
const ToggleLikeCommentUseCase = require('../../../../Applications/use_case/ToggleLikeCommentUseCase'); // 1. Import Use Case Baru

module.exports = ({ container, auth }) => {
  // Proses "Wiring" atau perakitan dependensi
  const addCommentUseCase = new AddCommentUseCase({ 
    threadRepository: container.threadRepository, 
    commentRepository: container.commentRepository,
  });
  
  const deleteCommentUseCase = new DeleteCommentUseCase({ 
    threadRepository: container.threadRepository, 
    commentRepository: container.commentRepository,
  });

  // 2. Rakit ToggleLikeCommentUseCase
  const toggleLikeCommentUseCase = new ToggleLikeCommentUseCase({
    commentRepository: container.commentRepository,
    threadRepository: container.threadRepository,
  });

  // 3. Masukkan ke dalam Constructor Handler (Parameter ke-3)
  const commentsHandler = new CommentsHandler(
    addCommentUseCase, 
    deleteCommentUseCase, 
    toggleLikeCommentUseCase
  );
  
  // Mengembalikan router Express untuk dipasang di createApp.js
  return routes(commentsHandler, auth);
};