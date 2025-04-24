const express = require('express');
const { Item } = require('../../db/models');
const plaid = require('plaid');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();
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

// FIXME: This route is not being used, instead added logic to create new item in the exchangePublicToken route
router.post('/', async (req, res) => {
  const { accessToken, itemId, userExternalId } = req.body;

  try {
    const newItem = await Item.create({
      accessToken,
      itemId,
      userExternalId
    });
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Failed to create item' });
  }
});

// Route to fetch all items for the logged-in user
router.get('/', async (req, res) => {
  const userExternalId = req.user.externalId;
  try {
    const items = await Item.getItemsForUser(userExternalId);
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// Route to delete an item
router.post('/delete', async (req, res) => {
  const { access_token } = req.body;
  try {
    await Item.deleteItem(access_token);
    console.log('Item removed from database');
    const response = await client.itemRemove({ access_token });
    console.log('Item removed from Plaid:', response.data);
    // Remove the item from the database
    await Item.deleteItem(access_token);
    console.log('Item removed from database');
    res.json(response.data);
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

module.exports = router;