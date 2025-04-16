const express = require('express');
const { Item } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

// FIXME: This route is not being used, instead added logic to create new item in the exchangePublicToken route
router.post('/', requireAuth, async (req, res) => {
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