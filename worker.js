// Lake waitlist endpoint. Static files are served by the assets binding;
// this Worker only handles requests that do not match a static asset.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    }
  });
}

async function waitlist(request, env) {
  if (request.method !== 'POST') return json({ ok: false, error: 'method' }, 405);

  let data;
  try {
    data = await request.json();
  } catch (_) {
    return json({ ok: false, error: 'bad request' }, 400);
  }

  // Honeypot: pretend to succeed so bots do not learn anything.
  if (data.website && String(data.website).trim() !== '') return json({ ok: true });

  const email = typeof data.email === 'string' ? data.email.trim().toLowerCase() : '';
  if (!email || email.length > 254 || !EMAIL.test(email)) {
    return json({ ok: false, error: 'invalid email' }, 400);
  }

  try {
    const result = await env.DB.prepare(
      'INSERT OR IGNORE INTO subscribers (email) VALUES (?)'
    ).bind(email).run();
    const inserted = !result.meta || result.meta.changes === 1;
    return json({ ok: true, duplicate: !inserted });
  } catch (err) {
    return json({ ok: false, error: 'storage unavailable' }, 500);
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/waitlist') return waitlist(request, env);
    return env.ASSETS.fetch(request);
  }
};
