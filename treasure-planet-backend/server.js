const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

const mongoURI = 'mongodb+srv://heravimh:GinDNrQBzT6ioQi5@planet0.xk6x7.mongodb.net/?retryWrites=true&w=majority&appName=planet0'; // Your MongoDB URI

async function connectToMongo() {
  const client = new MongoClient(mongoURI);
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    return client.db();
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello from the Treasure Planet backend!');
});

app.post('/api/register', async (req, res) => {
  try {
    const db = await connectToMongo();
    const { telegramUserId } = req.body;

    if (!telegramUserId) {
      return res.status(400).json({ error: 'Telegram user ID is required' });
    }

    const existingUser = await db.collection('users').findOne({ telegramUserId });

    if (existingUser) {
      return res.status(200).json({ message: 'User already registered', user: existingUser });
    }

    const newUser = {
      telegramUserId,
      webAppAuthorized: true,
    };

    const result = await db.collection('users').insertOne(newUser);

    res.status(201).json({ message: 'User registered successfully', user: result.insertedId });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

(async () => {
  try {
    const db = await connectToMongo();
    app.listen(port, () => {
      console.log(`Backend server listening on port ${port}`);
    });
  } catch (error) {
    console.error("Server startup error:", error);
  }
})();