const express = require('express');
const { Item } = require('../../db/models');

const router = express.Router();

// Route to create a new item
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