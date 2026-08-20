const express = require('express');
const cors = require('cors');
const AWS = require('aws-sdk');

const app = express();
app.use(express.json());
app.use(cors());

const REGION = process.env.AWS_REGION || 'ap-south-1';
const TABLE = process.env.DYNAMODB_TABLE || 'ThulasiTable';
AWS.config.update({ region: REGION });
const dynamoDB = new AWS.DynamoDB.DocumentClient();

app.get('/', (req, res) => {
  res.send('Thulasi Backend is running successfully 🚀');
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

const products = [
  { id: 1, name: 'Silk Saree', price: 2500, image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c' },
  { id: 2, name: 'T-Shirt', price: 500, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab' },
  { id: 3, name: 'Shirt', price: 800, image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157' },
  { id: 4, name: 'Dhoti', price: 1200, image: 'https://images.unsplash.com/photo-1620799139503-5c6c37c6d77f' }
];

app.get('/products', (req, res) => res.json(products));

let cart = [];
app.post('/cart', (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: 'Invalid data' });
  }
  cart.push(req.body);
  res.json({ message: 'Added to cart', cart });
});

let orders = [];
app.post('/order', (req, res) => {
  if (cart.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }
  const order = { id: Date.now(), items: cart };
  orders.push(order);
  cart = [];
  res.json({ message: 'Order placed', order });
});

app.get('/todos', async (req, res) => {
  try {
    const data = await dynamoDB.scan({ TableName: TABLE }).promise();
    res.json(data.Items || []);
  } catch (err) {
    console.error('GET TODOS ERROR:', err);
    res.status(500).json({ error: 'Error fetching todos' });
  }
});

app.post('/todos', async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: 'Invalid data' });
  }
  const item = { id: Date.now().toString(), ...req.body };
  try {
    await dynamoDB.put({ TableName: TABLE, Item: item }).promise();
    res.json(item);
  } catch (err) {
    console.error('ADD TODO ERROR:', err);
    res.status(500).json({ error: 'Error adding todo' });
  }
});

app.delete('/todos/:id', async (req, res) => {
  try {
    await dynamoDB.delete({ TableName: TABLE, Key: { id: req.params.id } }).promise();
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('DELETE TODO ERROR:', err);
    res.status(500).json({ error: 'Error deleting todo' });
  }
});

let contacts = [];
app.get('/contacts', (req, res) => res.json(contacts));
app.post('/contacts', (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: 'Invalid data' });
  }
  const contact = { id: Date.now(), ...req.body };
  contacts.push(contact);
  res.json(contact);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Container Network Ready');
  console.log(`AWS Region: ${REGION}`);
  console.log(`DynamoDB Table: ${TABLE}`);
});
