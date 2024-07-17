const express = require('express');
const path = require('path');
const app = express();
const itemsRouter = require(path.join(__dirname, 'routes', 'items'));

// Middleware to parse JSON bodies
app.use(express.json());

// Use items router
app.use('/items', itemsRouter);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
