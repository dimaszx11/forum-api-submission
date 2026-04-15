const express = require('express');

const routes = (handler) => {
  const router = express.Router();
  router.post('/authentications', handler.postAuthenticationHandler);
  router.put('/authentications', handler.putAuthenticationHandler);
  router.delete('/authentications', handler.deleteAuthenticationHandler);
  return router;
};

module.exports = routes;
