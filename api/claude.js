export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.CLAUDE_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'CLAUDE_KEY environment variable not set on server.' });
  }

  try {
    const body = {
      model: 'claude-haiku-4-5',
      max_tokens: 1800,
      messages: req.body.messages,
    };

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      const detail = data?.error?.message || JSON.stringify(data);
      return res.status(response.status).json({ error: detail });
    }

    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
