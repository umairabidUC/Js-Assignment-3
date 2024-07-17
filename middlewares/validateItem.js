const validateItem = (req, res, next) => {
  const { Topic, Duration, Link } = req.body;

  if (req.method === 'POST') {
    if (
      typeof Topic === 'string' &&
      typeof Duration === 'number' &&
      typeof Link === 'string'
    ) {
      next();
    } else {
      res.status(400).send('Invalid data format or missing fields');
    }
  } else if (req.method === 'PUT') {
    const validKeys = ['Topic', 'Duration', 'Link', 'status'];
    const keys = Object.keys(req.body);

    for (const key of keys) {
      if (!validKeys.includes(key)) {
        return res.status(400).send(`Invalid field: ${key}`);
      }

      if (key === 'Topic' && typeof req.body[key] !== 'string') {
        return res.status(400).send('Invalid data format for Topic');
      }

      if (key === 'Duration' && typeof req.body[key] !== 'number') {
        return res.status(400).send('Invalid data format for Duration');
      }

      if (key === 'Link' && typeof req.body[key] !== 'string') {
        return res.status(400).send('Invalid data format for Link');
      }

      if (key === 'status' && typeof req.body[key] !== 'boolean') {
        return res.status(400).send('Invalid data format for status');
      }
    }
    next();
  } else {
    next();
  }
};

module.exports = validateItem;
