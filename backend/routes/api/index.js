const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const plaidRouter = require('./plaid.js');
const itemsRouter = require('./item.js')

router.use('/session', sessionRouter);
router.use('/users', usersRouter);
router.use('/plaid', plaidRouter);
router.use('/items', itemsRouter);

module.exports = router;