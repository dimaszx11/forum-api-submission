const express = require('express');

const routes = (handler) => {
  const router = express.Router();
  router.post('/users', handler.postUserHandler);
  return router;
};

module.exports = routes;
