const express = require('express');
const path = require('path');
const router = express.Router();
const {
  getAllItems,
  getItemById,
  getItemsByStatus,
  addItem,
  updateItem,
  updateItemStatus,
  deleteItem,
} = require(path.join(__dirname, '..', 'models', 'item'));
const validateItem = require(path.join(__dirname, '..', 'middlewares', 'validateItem'));

// GET all items with optional status filter
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    let result;
    if (status !== undefined) {
      const statusBoolean = status.toLowerCase() === 'true';
      result = await getItemsByStatus(statusBoolean);
    } else {
      result = await getAllItems();
    }
    res.json(result);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// GET item by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const item = await getItemById(id);
    if (!item) {
      res.status(404).send('Item not found');
    } else {
      res.json(item);
    }
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// POST a new item
router.post('/', validateItem, async (req, res) => {
  try {
    let newItem = await addItem(req.body);
    res.status(201).json(newItem);
  } catch (err) {
    console.log(err)
    res.status(500).send('Server error');
  }
});

// PUT (update) an item by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const fields = req.body;

  if (Object.keys(fields).length === 0) {
    return res.status(400).send('No fields provided for update');
  }

  try {
    const updatedItem = await updateItem(id, fields);
    if (!updatedItem) {
      res.status(404).send('Item not found');
    } else {
      res.json(updatedItem);
    }
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// PATCH (update status) an item by ID
router.patch('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (typeof status !== 'boolean') {
    return res.status(400).send('Invalid status format');
  }
  try {
    const updatedItem = await updateItemStatus(id, status);
    if (!updatedItem) {
      res.status(404).send('Item not found');
    } else {
      res.json(updatedItem);
    }
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// DELETE an item by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedItem = await deleteItem(id);
    if (!deletedItem) {
      res.status(404).send('Item not found');
    } else {
      res.json(deletedItem);
    }
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
