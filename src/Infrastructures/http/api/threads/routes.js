const express = require('express');

const routes = (handler, auth) => {
  const router = express.Router();
  
  router.post('/threads', auth, handler.postThreadHandler);
  router.get('/threads/:threadId', handler.getThreadDetailHandler);
  
  return router;
};

module.exports = routes;