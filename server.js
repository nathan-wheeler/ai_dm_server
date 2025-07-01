const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

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
    res.json(data);
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
