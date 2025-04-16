const express = require('express');
const { Item } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();
router.use(requireAuth);

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
  console.log('ROUTE - Fetching items for user');
  const userExternalId = req.user.externalId;
  try {
    const items = await Item.getItemsForUser(userExternalId);
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

module.exports = router;