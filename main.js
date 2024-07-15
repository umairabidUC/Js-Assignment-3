const express = require('express');
const app = express();

const {Pool} =  require('pg')

// Middleware to parse JSON bodies
app.use(express.json());



// Setting up the PostgreSQL Client:

const pool = new Pool({
  user: 'Umair', 
  host: 'localhost',
  database: 'itemsdb',
  password: 'umair', 
  port: 5432,
});


// A utility function which validates the incoming data in the POST Request.
const validateItem = (item) => {
  if (typeof item !== 'object' || item === null) {
    return { valid: false, message: 'Data should be an object' };
  }

  const { Topic, Duration, Link, id, Status } = item;
  if (
    typeof Topic === 'string' &&
    typeof Duration === 'string' &&
    typeof Link === 'string' &&
    typeof id === 'string' &&
    typeof Status === 'string'
  ) {
    return { valid: true };
  }

  return { valid: false, message: 'Invalid data format or missing fields' };
};


// GET all items
app.get('/items', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM items');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send('Server error');
  }
});


// GET item by ID
app.get('/items/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM items WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      res.status(404).send('Item not found');
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// GET items by Status
app.get('/items/:status', (req, res, next) => {
  const { status } = req.params;
  if (status !== 'show' && status !== 'hide') { // In case anything other than show or hide is sent in the request.
    return res.status(400).send('Invalid status. Only "show" or "hide" are allowed.');
  }
  const filteredItems = items.filter(item => item.Status === status);
  res.json(filteredItems);
});



// POST a new item
app.post('/items', async (req, res) => {
  const validation = validateItem(req.body);
  if (validation.valid) {
    const { Topic, Duration, Link, Status } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO items (topic, duration, link, status) VALUES ($1, $2, $3, $4) RETURNING *',
        [Topic, Duration, Link, Status]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(500).send('Server error');
    }
  } else {
    res.status(400).send(validation.message);
  }
});

// PUT (update) an item by ID
app.put('/items/:id', (req, res, next) => {
  const { id } = req.params;
  const itemIndex = items.findIndex(item => item.id === id);
  const validation = validateItem(req.body); // Using the validation function to check if the data is in correct format

  if (itemIndex !== -1) {
    if (validation.valid) {
      items[itemIndex] = {
        Topic: req.body.Topic,
        Duration: req.body.Duration,
        Link: req.body.Link,
        id: req.body.id,
        Status: req.body.Status,
      };
      res.json(items[itemIndex]);
    } else {
      res.status(400).send(validation.message);
    }
  } else {
    res.status(404).send('Item not found');
  }
});



// DELETE an item by ID specified in path
app.delete('/items/:id', (req, res, next) => {
  const { id } = req.params;
  const itemIndex = items.findIndex(item => item.id === id);
  if (itemIndex !== -1) {
    const deletedItem = items.splice(itemIndex, 1);
    res.json(deletedItem);
  } else {
    res.status(404).send('Item not found');
  }
});

// Starting the LocalHost Server Here:
const PORT = 3000;
app.listen(PORT, () => {
  console.log('Server is running on port ${PORT}');
});