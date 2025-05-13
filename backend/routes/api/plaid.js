require('dotenv').config();
const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { Item } = require('../../db/models');
const plaidClient = require('../../utils/plaidClient');
const plaidController = require('./controllers/plaidController');
const itemController = require('./controllers/itemController');
const router = express.Router();

// require authentication middleware to ensure the user is authenticated before allowing access to the routes
router.use(requireAuth);

// Route to create a Link token
router.post('/create_link_token', plaidController.createLinkToken);

// Route to exchange the public token for an access token
router.post('/exchange_public_token', plaidController.exchangePublicToken);

// Route to update item metadata
router.post('/item/get_and_update_metadata', itemController.updateItemMetadata);

// Route to create a sandbox public token
router.post('/sandbox_public_token/create', plaidController.sandboxPublicTokenCreate);

// Route to fetch accounts
router.post('/accounts/get', async (req, res) => {
  const { access_token } = req.body;

  try {
    const response = await plaidClient.accountsGet({ access_token });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching accounts:', error);
    res.status(500).json({ error: 'Failed to fetch accounts' });
  }
});



module.exports = router;