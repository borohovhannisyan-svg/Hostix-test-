// Configure MIGRATION_WEBHOOK_URL for the team's mail/ticket delivery service.
// A 2xx response from that service must mean that the request was accepted.
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
  const email = clean('email'), domain = clean('domain'), description = clean('description'), page = clean('page');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || (!domain && !description) || domain.length > 253 || description.length > 2000 || page.length > 200) return res.status(400).json({accepted: false});
  const endpoint = process.env.MIGRATION_WEBHOOK_URL;
  if (!endpoint) return res.status(503).json({accepted: false});
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', ...(process.env.MIGRATION_WEBHOOK_TOKEN ? {Authorization: `Bearer ${process.env.MIGRATION_WEBHOOK_TOKEN}`} : {})},
      body: JSON.stringify({type: 'website-migration', email, domain, description, page}),
      signal: AbortSignal.timeout(15000)
    });
    if (!response.ok) return res.status(502).json({accepted: false});
    return res.status(200).json({accepted: true});
  } catch { return res.status(502).json({accepted: false}); }
};
