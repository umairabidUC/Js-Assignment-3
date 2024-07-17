const path = require('path');
const pool = require(path.join(__dirname, '..', 'db'));

const getAllItems = async () => {
  const result = await pool.query('SELECT * FROM items');
  return result.rows;
};

const getItemById = async (id) => {
  const result = await pool.query('SELECT * FROM items WHERE id = $1', [id]);
  return result.rows[0];
};

const getItemsByStatus = async (status) => {
  const result = await pool.query('SELECT * FROM items WHERE status = $1', [status]);
  return result.rows;
};

const addItem = async (item) => {
  let { Topic, Duration, Link, status } = item;
  if (status === null || status === undefined) {
    status = true; // Set default status to true
  }
  const result = await pool.query(
    'INSERT INTO items (Topic, Duration, Link, status) VALUES ($1, $2, $3, $4) RETURNING *',
    [Topic, Duration, Link, status]
  );
  return result.rows[0];
};

const updateItem = async (id, fields) => {
  const query = [];
  const values = [id];
  let index = 2;

  for (const [key, value] of Object.entries(fields)) {
    query.push(`${key} = $${index}`);
    values.push(value);
    index += 1;
  }

  const result = await pool.query(
    `UPDATE items SET ${query.join(', ')} WHERE id = $1 RETURNING *`,
    values
  );

  return result.rows[0];
};

const updateItemStatus = async (id, status) => {
  const result = await pool.query(
    'UPDATE items SET status = $1 WHERE id = $2 RETURNING *',
    [status, id]
  );
  return result.rows[0];
};

const deleteItem = async (id) => {
  const result = await pool.query('DELETE FROM items WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

module.exports = {
  getAllItems,
  getItemById,
  getItemsByStatus,
  addItem,
  updateItem,
  updateItemStatus,
  deleteItem,
};
