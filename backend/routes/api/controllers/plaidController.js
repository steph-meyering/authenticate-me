const plaidClient = require("../../../utils/plaidClient");
const itemController = require("./itemController");

// Maps to plaid endpoint /link/token/create
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
// Maps to plaid endpoint /sandbox/public_token/exchange
exports.exchangePublicToken = async (req, res) => {
  const { public_token } = req.body;
  const userExternalId = req.user.externalId;

  try {
    const response = await plaidClient.itemPublicTokenExchange({ public_token });
    const { access_token, item_id } = response.data;
    // Delegate to Item logic
    await itemController.savePlaidItem({ access_token, item_id, userExternalId });
    await itemController.updateItemMetadata(access_token);
    res.json({ access_token });
  } catch (error) {
    console.error('Error exchanging token:', error);
    res.status(500).json({ error: 'Failed to exchange token' });
  }
};

// Maps to plaid endpoint /item/get
exports.getItem = async (req, res) => {
  const { access_token } = req.body;
  try {
    return await plaidClient.itemGet({ access_token });
  } catch (error) {
    console.error('Error updating item metadata:', error);
    res.status(500).json({ error: 'Failed to update item metadata' });
  }
};

exports.sandboxPublicTokenCreate = async (req, res) => {
  const { institution_id, initial_products } = req.body;
  try {
    const response = await plaidClient.sandboxPublicTokenCreate({
      institution_id,
      initial_products,
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error creating sandbox public token:', error);
    res.status(500).json({ error: 'Failed to create sandbox public token' });
  }
}