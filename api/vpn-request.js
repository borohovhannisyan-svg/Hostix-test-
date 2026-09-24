// Configure VPN_REQUEST_WEBHOOK_URL for the team's mail/ticket delivery service.
module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({accepted: false});
  }
  if (!String(req.headers['content-type'] || '').includes('application/json')) return res.status(415).json({accepted: false});
  try {
    if (req.headers.origin && new URL(req.headers.origin).host !== req.headers.host) return res.status(403).json({accepted: false});
  } catch { return res.status(403).json({accepted: false}); }

  let data;
  try { data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body; }
  catch { return res.status(400).json({accepted: false}); }
  if (!data || typeof data !== 'object') return res.status(400).json({accepted: false});

  const clean = key => typeof data[key] === 'string' ? data[key].trim() : '';
  const product = clean('product');
  const email = clean('email');
  const task = clean('task');
  const page = clean('page');
  if (!new Set(['armenia', 'europe', 'server', 'corporate']).has(product) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || !task || task.length > 2000 || page.length > 200) return res.status(400).json({accepted: false});

  const endpoint = process.env.VPN_REQUEST_WEBHOOK_URL;
  if (!endpoint) return res.status(503).json({accepted: false});
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', ...(process.env.VPN_REQUEST_WEBHOOK_TOKEN ? {Authorization: `Bearer ${process.env.VPN_REQUEST_WEBHOOK_TOKEN}`} : {})},
      body: JSON.stringify({type: 'vpn-request', product, email, task, page}),
      signal: AbortSignal.timeout(15000)
    });
    if (!response.ok) return res.status(502).json({accepted: false});
    return res.status(200).json({accepted: true});
  } catch { return res.status(502).json({accepted: false}); }
};
