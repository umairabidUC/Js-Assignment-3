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
// Using async awaits promises for db connections.
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




// GET items by Status *Here using a /status/ path to so that /items/:id does not conflict with this search.
app.get('/items/status/:status', async (req, res) => {
  const { status } = req.params;
  if (status !== 'show' && status !== 'hide') {
    return res.status(400).send('Invalid status. Only "show" or "hide" are allowed.');
  }
  try {
    const result = await pool.query('SELECT * FROM items WHERE status = $1', [status]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).send('Server error');
  }
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
app.put('/items/:id', async (req, res) => {
  const { id } = req.params;
  const validation = validateItem(req.body);
  if (validation.valid) {
    const { Topic, Duration, Link, Status } = req.body;
    try {
      const result = await pool.query(
        'UPDATE items SET topic = $1, duration = $2, link = $3, status = $4 WHERE id = $5 RETURNING *',
        [Topic, Duration, Link, Status, id]
      );
      if (result.rows.length === 0) {
        res.status(404).send('Item not found');
      } else {
        res.json(result.rows[0]);
      }
    } catch (err) {
      res.status(500).send('Server error');
    }
  } else {
    res.status(400).send(validation.message);
  }
});



// DELETE an item by ID specified in path
app.delete('/items/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM items WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      res.status(404).send('Item not found');
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Starting the LocalHost Server Here:
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});