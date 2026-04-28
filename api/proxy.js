export default async function handler(req, res) {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { apiKey, messages, temperature, max_tokens } = req.body;

  if (!apiKey) {
    return res.status(400).json({ error: 'API Key is required' });
  }

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: messages,
        temperature: temperature || 0.8,
        max_tokens: max_tokens || 2000
      })
    });

    const data = await response.json();

    if (!response.ok) {
      // 转发 DeepSeek 的错误信息
      return res.status(response.status).json({ error: data.error?.message || 'API request failed' });
    }

    const content = data.choices[0].message.content;
    return res.status(200).json({ success: true, content });
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
