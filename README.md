# Lake

The good life is a shared life. A static marketing site for Lake, a calm savings
app for couples, with a working iPhone demo and a live waitlist.

The site is a plain static site (`public/index.html`, `public/styles.css`,
`public/app.js`, self-hosted font in `public/fonts/`) plus one small Cloudflare
Worker (`worker.js`) that stores waitlist emails in D1.

## Local development

```bash
npm install
npm run dev
```

## Deploy

Production lives at `https://golake.app/` on Cloudflare. The custom domain is
attached to the Worker named `odd-snow-0a72`; `wrangler deploy` keeps it.

```bash
npm run deploy:preview   # optional: lake-preview.<account>.workers.dev
npm run deploy
```

The separate `/samrajya` Worker is a different Cloudflare Worker with its own
more-specific routes. Nothing in this project touches it.

## Waitlist storage

Emails are stored in the Cloudflare D1 database **`lake-waitlist`**
(ID `2caf93ba-0592-481e-a602-5281c66d5386`), table `subscribers`, with columns
`email` (primary key) and `created_at`. Duplicate addresses are ignored. A
hidden honeypot field is present in the form, and no secrets are shipped to the
browser.

Export them with:

```bash
npx wrangler d1 export lake-waitlist --remote --output waitlist.csv
```

Or open the D1 database in the Cloudflare dashboard and browse/query the table.
The preview Worker uses a separate `lake-waitlist-preview` database so test
sign-ups never mix with real ones.
