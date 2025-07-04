const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cors({
  origin: 'https://nathan-wheeler.github.io'
}));

app.post('/api/chat', async (req, res) => {
  const messages = req.body.messages;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages,
        max_tokens: 1000
      })
    });

    const data = await response.json();
    console.log('🧠 OpenAI Response:', data);
    if (!data.choices) {
      return res.status(500).json({ error: 'OpenAI response missing choices', raw: data });
    }
    res.json(data);
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("👋 Hello from server startup");
});
