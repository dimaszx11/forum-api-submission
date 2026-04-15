const express = require('express');

const routes = (handler, auth) => {
  const router = express.Router();
  
  // Menambahkan komentar baru ke thread
  router.post('/threads/:threadId/comments', auth, handler.postCommentHandler);
  
  // Menghapus komentar dari thread
  router.delete('/threads/:threadId/comments/:commentId', auth, handler.deleteCommentHandler);
  
  // KRITERIA OPSIONAL: Menyukai atau batal menyukai komentar
  // Method: PUT
  // Path: /threads/{threadId}/comments/{commentId}/likes
  router.put('/threads/:threadId/comments/:commentId/likes', auth, handler.putLikeCommentHandler);
  
  return router;
};

module.exports = routes;