// Netlify Function — Email sender (server-side, keys never exposed to browser)
// Called by client JS with POST /api/send-email

const https = require('https');

const SERVICE_ID  = process.env.EMAILJS_SERVICE_ID;
const PUBLIC_KEY  = process.env.EMAILJS_PUBLIC_KEY;
const PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY;

function emailjsPost(templateId, params) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      service_id:  SERVICE_ID,
      template_id: templateId,
      user_id:     PUBLIC_KEY,
      accessToken: PRIVATE_KEY,
      template_params: params
    });

    const options = {
      hostname: 'api.emailjs.com',
      path:     '/api/v1.0/email/send',
      method:   'POST',
      headers:  {
        'Content-Type':   'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Basic origin check
  const origin = event.headers.origin || event.headers.referer || '';
  const allowed = [
    'https://foresta.ae',
    'https://www.foresta.ae',
    'https://forestaw26.netlify.app',
    'https://forestawebsite.web.app',
    'http://127.0.0.1:5500',
    'http://127.0.0.1:5502',
    'http://localhost:5500'
  ];
  const isAllowed = allowed.some(o => origin.startsWith(o));
  if (!isAllowed) {
    return { statusCode: 403, body: 'Forbidden' };
  }

  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  const { templateId, params } = payload;
  if (!templateId || !params) {
    return { statusCode: 400, body: 'Missing templateId or params' };
  }

  // Resolve template alias to actual template ID (kept server-side)
  const TEMPLATE_MAP = {
    'owner':    process.env.EMAILJS_TEMPLATE_OWNER,
    'customer': process.env.EMAILJS_TEMPLATE_CUSTOMER
  };
  const resolvedTemplate = TEMPLATE_MAP[templateId];
  if (!resolvedTemplate) {
    return { statusCode: 400, body: 'Invalid template' };
  }

  try {
    const result = await emailjsPost(resolvedTemplate, params);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true })
    };
  } catch (err) {
    console.error('[send-email] Error:', err);
    return { statusCode: 500, body: 'Email send failed' };
  }
};
