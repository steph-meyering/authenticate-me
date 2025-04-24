require('dotenv').config();
const express = require('express');
const plaid = require('plaid');
const { requireAuth } = require('../../utils/auth');
const { Item } = require('../../db/models');

const router = express.Router();

// require authentication middleware
// This middleware checks if the user is authenticated before allowing access to the routes
router.use(requireAuth);

const client = new plaid.PlaidApi(
  new plaid.Configuration({
    basePath: plaid.PlaidEnvironments[process.env.PLAID_ENV],
    baseOptions: {
      headers: {
        'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
        'PLAID-SECRET': process.env.PLAID_SECRET,
        'Plaid-Version': '2020-09-14',
      },
    },
  })
);

// Route to create a Link token
router.post('/create_link_token', async (req, res) => {
  const { external_id } = req.body;
  try {
    const response = await client.linkTokenCreate({
      user: { client_user_id: external_id },
      client_name: 'Authenticate Me Plaid',
      products: ['auth', 'transactions'],
      country_codes: ['US'],
      language: 'en',
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error creating link token:', error);
    res.status(500).json({ error: 'Failed to create link token' });
  }
});

// Route to exchange the public token for an access token
router.post('/exchange_public_token', async (req, res) => {
  const { public_token } = req.body;
  const userExternalId = req.user.externalId;

  try {
    const response = await client.itemPublicTokenExchange({ public_token });
    const { access_token, item_id } = response.data;

    // Persist Plaid item to DB
    const newItem = await Item.create({
      accessToken: access_token,
      itemId: item_id,
      userExternalId,
    });
    // Send the access token back to the client
    res.json({ access_token });

  } catch (error) {
    console.error('Error exchanging token:', error);
    res.status(500).json({ error: 'Failed to exchange token' });
  }
});
// Route to fetch item
router.post('/item/get', async (req, res) => {
  const { access_token } = req.body;
  try {
    const response = await client.itemGet({ access_token });
    // Update the item in the database
    const { item_id, institution_id, institution_name, webhook, error } = response.data.item;
    await Item.updateItem(item_id, {
      institutionId: institution_id,
      institutionName: institution_name,
      webhook,
      error,
    });
    // Send the item data back to the client
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

// Route to fetch accounts
router.post('/accounts/get', async (req, res) => {
  const { access_token } = req.body;

  try {
    const response = await client.accountsGet({ access_token });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching accounts:', error);
    res.status(500).json({ error: 'Failed to fetch accounts' });
  }
});

// Route to create a sandbox public token
router.post('/sandbox_public_token/create', async (req, res) => {
  const { institution_id, initial_products } = req.body;

  try {
    const response = await client.sandboxPublicTokenCreate({
      institution_id,
      initial_products,
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error creating sandbox public token:', error);
    res.status(500).json({ error: 'Failed to create sandbox public token' });
  }
});


module.exports = router;