// backend/routes/api/index.js
const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const plaidRouter = require('./plaid.js');

router.use('/session', sessionRouter);
router.use('/users', usersRouter);
router.use('/plaid', plaidRouter);

module.exports = router;