const plaidClient = require("../../../utils/plaidClient");

exports.createLinkToken = async (req, res) => {
  const { external_id } = req.body;
  try {
    const response = await plaidClient.linkTokenCreate({
      user: { client_user_id: external_id },
      client_name: 'Your App',
      products: ['auth', 'transactions'],
      country_codes: ['US'],
      language: 'en',
    });
    res.json(response.data);
  } catch (err) {
    console.error('Link token error:', err);
    res.status(500).json({ error: 'Failed to create link token' });
  }
};