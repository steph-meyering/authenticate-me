require('dotenv').config();
const express = require('express');
const plaid = require('plaid');

const router = express.Router();

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

  try {
    const response = await client.itemPublicTokenExchange({ public_token });
    const { access_token } = response.data;

    // Save access_token securely (e.g., DB)
    res.json({ access_token });
  } catch (error) {
    console.error('Error exchanging token:', error);
    res.status(500).json({ error: 'Failed to exchange token' });
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

module.exports = router;