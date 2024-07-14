const express = require('express');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Array to store items
let items = [{Topic: 'Basics', Duration: '02 Hours 43 Minutes', Link: 'https://google.com', id: '1', Status: 'show'}];


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
app.get('/items', (req, res) => {
  res.json(items);
});



// GET item by ID
app.get('/items/:id', (req, res) => {
  const { id } = req.params;
  const item = items.find(item => item.id === id);
  if (item) {
    res.json(item);
  } else {
    res.status(404).send('Item not found');
  }
});



// POST a new item
app.post('/items', (req, res) => {
    const validation = validateItem(req.body); // Using Validate Function to check whether the incoming data is correct or not.
  
    if (validation.valid) {
      const newItem = {
        Topic: req.body.Topic,
        Duration: req.body.Duration,
        Link: req.body.Link,
        id: req.body.id,
        Status: req.body.Status,
      };
      items.push(newItem);
      res.status(201).json(newItem);
    } else {
      res.status(400).send(validation.message);
    }
  });
  
  // PUT (update) an item by ID
  app.put('/items/:id', (req, res) => {
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
app.delete('/items/:id', (req, res) => {
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