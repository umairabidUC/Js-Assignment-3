const express = require('express');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Array to store items
let items = [];

// Middleware for validation
const validateItem = (req, res, next) => {
  const { topic, duration, link } = req.body;
  if (
    typeof topic === 'string' &&
    typeof duration === 'number' &&
    typeof link === 'string'
  ) {
    next();
  } else {
    res.status(400).send('Invalid data format or missing fields');
  }
};

// GET all items with optional status filter
app.get('/items', (req, res) => {
  const { status } = req.query;
  if (status !== undefined) {
    const statusBoolean = status.toLowerCase() === 'true';
    const filteredItems = items.filter(item => item.status === statusBoolean);
    res.json(filteredItems);
  } else {
    res.json(items);
  }
});

// GET item by ID
app.get('/items/:id', (req, res) => {
  const { id } = req.params;
  const item = items.find(item => item.id === parseInt(id));
  if (item) {
    res.json(item);
  } else {
    res.status(404).send('Item not found');
  }
});

// POST a new item
app.post('/items', validateItem, (req, res) => {
  const { topic, duration, link } = req.body;
  const newItem = {
    id: items.length ? items[items.length - 1].id + 1 : 1, // Incremental ID
    topic,
    duration,
    link,
    status: false, // Default status
  };
  items.push(newItem);
  res.status(201).json(newItem);
});

// PUT (update) an item by ID
app.put('/items/:id', (req, res) => {
  const { id } = req.params;
  const itemIndex = items.findIndex(item => item.id === parseInt(id));
  if (itemIndex === -1) {
    return res.status(404).send('Item not found');
  }
  
  const { topic, duration, link, status } = req.body;
  if (topic !== undefined) items[itemIndex].topic = topic;
  if (duration !== undefined) items[itemIndex].duration = duration;
  if (link !== undefined) items[itemIndex].link = link;
  if (status !== undefined) items[itemIndex].status = status;

  res.json(items[itemIndex]);
});

// PATCH (update status) an item by ID
app.patch('/items/:id/status', (req, res) => {
  const { id } = req.params;
  const itemIndex = items.findIndex(item => item.id === parseInt(id));
  if (itemIndex === -1) {
    return res.status(404).send('Item not found');
  }

  const { status } = req.body;
  if (typeof status !== 'boolean') {
    return res.status(400).send('Invalid status format');
  }

  items[itemIndex].status = status;
  res.json(items[itemIndex]);
});

// DELETE an item by ID
app.delete('/items/:id', (req, res) => {
  const { id } = req.params;
  const itemIndex = items.findIndex(item => item.id === parseInt(id));
  if (itemIndex !== -1) {
    const [deletedItem] = items.splice(itemIndex, 1);
    res.json(deletedItem);
  } else {
    res.status(404).send('Item not found');
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
