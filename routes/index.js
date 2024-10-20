const express = require('express');
const commerceRoutes = require('./commerce');
const webCommerceRoutes = require('./webCommerce');

module.exports = (upload) => {
  const router = express.Router();

  router.use('/commerce', commerceRoutes);
  // router.use('/webCommerce', webCommerceRoutes(upload));

  return router;
};