// backend/routes/index.js
const express = require('express');
const router = express.Router();
const apiRouter = require('./api');
router.use('/api', apiRouter);

router.get('/hello/world', function(req, res) {
  // Call req.csrfToken() to generate the token
  const csrfToken = req.csrfToken();
  res.cookie('XSRF-TOKEN', csrfToken);
  console.log("CSRF TOKEN:", csrfToken);
  res.send('Hello World!');
});

module.exports = router;