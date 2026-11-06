# Amplii landing: launch and domains

Where the site lives, how the old address redirects to it, and when the old GitHub Pages site can go.

## What's live

- **https://amplii.app** is the official address. The domain is registered at Porkbun, and the site is served by Vercel from `main`.
- **www.amplii.app** also points to Vercel and redirects to https://amplii.app.
- **amplii.amplificationinstitute.com** is a subdomain of amplificationinstitute.com, whose DNS is at GoDaddy. Until the redirect below is in place, its `amplii` CNAME points to `amplificiationinstitute.github.io` (that misspelling is what's in DNS), and GitHub Pages serves the frozen old site from the `legacy-pages` branch. App Store Connect still links to this address (`/privacy.html`, `/support.html` and `/`).

**Who does what:**

- **Ana:** GitHub, Vercel, Porkbun and App Store Connect.
- **Marie:** the one DNS change at GoDaddy for amplificationinstitute.com.

`legacy-pages` is the old site. Never push `main` (or anything else) to it: Pages would publish the new code's README and `/privacy.html` would return 404.

## 1. amplii.app as the main domain in Vercel

Vercel → amplii-site → Settings → Domains:

- `amplii.app`: serves the site (no redirect), Production.
- `www.amplii.app`: **Redirect to** `amplii.app`, status **308**.

Check:

```
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" https://amplii.app/
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" https://www.amplii.app/privacy.html
```

Expect `200` for the first, and `308 https://amplii.app/privacy.html` for the second.

## 2. Redirect amplii.amplificationinstitute.com to amplii.app

Every path goes to the same path on amplii.app with a permanent 308: `/privacy.html` → `https://amplii.app/privacy.html`, `/support.html` → `https://amplii.app/support.html`, and so on. GitHub Pages and `legacy-pages` stay untouched until step 3 passes.

**The day before (Marie, GoDaddy):** DNS → the `amplii` CNAME → TTL **600 seconds** (10 minutes), so the switch and any rollback take effect quickly.

**In Vercel (Ana):**

1. Settings → Domains → **Add Domain** → `amplii.amplificationinstitute.com`.
2. Choose **Redirect to Another Domain** → `amplii.app`, status **308 Permanent Redirect**. Vercel keeps the path and query string.
3. Vercel shows "Invalid Configuration" and the DNS record to set. Copy the CNAME value exactly as shown (`cname.vercel-dns.com` or a project-specific `…vercel-dns…` address). If it also asks for a TXT record on `_vercel.amplificationinstitute.com`, copy that too.

**At GoDaddy (Marie), one record:**

| Type  | Name     | Points to               | TTL |
| ----- | -------- | ----------------------- | --- |
| CNAME | `amplii` | the value Vercel showed | 600 |

Edit the existing `amplii` record, don't add a second one. Add the `_vercel` TXT record only if Vercel asked for it. Don't touch any other record: the main domain and email stay as they are.

**Wait:** `dig +short amplii.amplificationinstitute.com` shows the Vercel address, and Vercel → Domains says **Valid Configuration**. Vercel then issues the HTTPS certificate, usually within minutes. In that gap, https on the old address can show a certificate warning briefly; http keeps working.

## 3. Check the redirect

```
O=https://amplii.amplificationinstitute.com
curl -sI $O/ | grep -iE '^(HTTP|server|location)'
for p in / /privacy.html /support.html /terms.html /privacy /support /terms "/?from=test"; do curl -s -o /dev/null -w "%{http_code} %{redirect_url}  $p\n" "$O$p"; done
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" http://amplii.amplificationinstitute.com/privacy.html
curl -sL -o /dev/null -w "%{http_code} %{url_effective}\n" $O/privacy.html
```

What you should see:

- `server: Vercel`.
- **308** for every path, each to the same path on `https://amplii.app` (the query string kept).
- The http address redirects too (to https, then to amplii.app).
- The last line ends at **200 https://amplii.app/privacy.html**.

Then by hand:

- **App Store Connect:** open the Privacy Policy URL, Support URL and Marketing URL. Each lands on the same page on amplii.app.
- **iPhone, Safari:** open https://amplii.amplificationinstitute.com/support.html and check you land on the support page on amplii.app.

**If something goes wrong:** Marie points the `amplii` CNAME back to `amplificiationinstitute.github.io`. GitHub Pages is still serving `legacy-pages`, so the old site is back within about 10 minutes.

## 4. App Store Connect

- Change the URLs to amplii.app directly, so they no longer depend on the redirect: `https://amplii.app/privacy.html`, `https://amplii.app/support.html` and `https://amplii.app/`. The Privacy Policy URL (App Privacy) can be changed at any time; the Support and Marketing URLs are part of the app version, so they change with the next version you submit.
- Keep the redirect anyway: old links stay out there (search results, shared links, older app versions).
- With the app update that adds Purchase backup: update the App Privacy label. It can no longer say "Data Not Collected". Declare the optional backup email as Contact Info → Email Address, used for App Functionality, not used for tracking. It's tied to a purchase, so it most likely counts as linked to the user.

## 5. Turn GitHub Pages off, then delete legacy-pages

Safe once all of this is true:

- Step 3 passed, with `server: Vercel` on the old address.
- At least 48 hours have passed since the DNS change, so no cache still sends people to GitHub.

Then:

1. GitHub → amplii-site → Settings → Pages → remove the custom domain, then unpublish (Source: **None**).
2. Run the step 3 checks again: nothing should change.
3. **A few weeks later**, once nothing has gone wrong, delete the branch: `git push origin --delete legacy-pages`.
4. Cleanup PR: remove `public/CNAME`, which only GitHub Pages used.

## 6. Search engines (phase 4)

Add https://amplii.app to Google Search Console and Bing Webmaster Tools and submit `https://amplii.app/sitemap.xml`. Once the redirect works, also add the old address in Search Console and try **Change of Address** to amplii.app. If Search Console doesn't offer it for this subdomain, the 308 redirects alone move it over time.
