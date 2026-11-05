# Amplii landing: launch steps

How the site moves from GitHub Pages to Vercel on amplii.amplificationinstitute.com. Do this only after Marie approves.

**Who does what:**

- **Ana:** GitHub, Vercel and App Store Connect.
- **Whoever has the GoDaddy login for amplificationinstitute.com:** the DNS change. The domain's nameservers are `ns77/ns78.domaincontrol.com` (GoDaddy).

**Why the order matters:** GitHub Pages publishes the root of `main` today. After the merge, `main`'s root has no `index.html`, so Pages would publish the README and `/privacy.html` would return 404. Step 4 moves Pages to a frozen copy of the old site first, so the App Store links never break, and that copy stays the way back until the very end.

## Before launch day

- [ ] Marie has approved the site, including the science sources.
- [ ] Every open PR is merged into `develop`.
- [ ] The App Store campaign links are in (`src/lib/app-store.ts`, still `[TODO]`), or Ana has decided to launch without them.
- [ ] Checks (phase 3d) done: Lighthouse, keyboard, Chrome and Safari on Mac, Safari and Chrome on iPhone. Still to do on devices: VoiceOver on iPhone and Safari on iPad.

## The day before

1. **Vercel settings:**
   - Project amplii-site → Settings → Git → **Production Branch** is `main`.
   - Settings → **Deployment Protection** protects previews only, so the real domain stays public.
2. **App Store Connect:** the support email shown anywhere in the app's details is contact@amplificationinstitute.com.
3. **Lower the TTL in GoDaddy** (DNS person): DNS → the `amplii` CNAME → TTL **600 seconds**. It currently points to `amplificiationinstitute.github.io`. That misspelling is what's in DNS now; leave it, it gets replaced in step 8.

## Launch

4. **Freeze the old site on its own branch:**

   ```
   cd ~/Developer/Projects/amplii-site
   git fetch origin
   git push origin origin/main:refs/heads/legacy-pages
   ```

   Then GitHub → amplii-site → Settings → Pages → Branch: **legacy-pages**, folder **/ (root)** → Save. Wait for "Your site is live", and check that https://amplii.amplificationinstitute.com still shows the old page.

5. **Merge develop into main:**

   ```
   gh pr create --base main --head develop --title "Release: Amplii landing page" --body "Launch, approved by Marie."
   gh pr merge --merge
   ```

6. **Vercel builds production** from `main` on its own. In Vercel → Deployments, wait for the Production deployment to be **Ready**, then open its `.vercel.app` address and look through the page.
7. **Add the domain in Vercel:** Settings → Domains → Add → `amplii.amplificationinstitute.com`. It will say "Invalid Configuration" and show the DNS record to set. Copy the CNAME value exactly as shown (either `cname.vercel-dns.com` or a project-specific address). If it also asks for a `_vercel` TXT record, note that too.
8. **Change the DNS in GoDaddy** (DNS person): edit the `amplii` CNAME → **Points to** = the value from Vercel, TTL 600. Add the TXT record if Vercel asked for one. Don't touch any other record: the main domain and email stay as they are.
9. **Wait for the switch:** `dig +short amplii.amplificationinstitute.com` shows the Vercel address, and Vercel → Domains says **Valid Configuration**. The HTTPS certificate is issued automatically. This usually takes minutes, up to an hour.

## Checks

```
cd ~/Developer/Projects/amplii-site
git fetch origin
D=https://amplii.amplificationinstitute.com
curl -sI $D/ | grep -iE '^(HTTP|server)'
for p in / /privacy.html /support.html /terms.html /privacy /support /terms /robots.txt /sitemap.xml /favicon.ico /icon-32.png /apple-touch-icon.png /site.webmanifest /og-image.jpg; do curl -s -o /dev/null -w "%{http_code} %{redirect_url} $p\n" "$D$p"; done
curl -s -o /dev/null -w "%{http_code} /a-missing-page\n" $D/a-missing-page
for p in privacy support terms; do echo "$p: $(curl -s $D/$p.html | shasum | cut -c1-12) live, $(git show origin/main:public/$p.html | shasum | cut -c1-12) main"; done
curl -sI http://amplii.amplificationinstitute.com/ | head -3
```

What you should see:

- `server: Vercel` on the first line.
- **200** with no redirect address for every path, including `/privacy.html` and `/support.html`, which the App Store uses.
- **404** for the missing page.
- The same two codes on each privacy / support / terms line: the live legal pages are exactly the ones in `main` (with the Purchase backup section, the icons and contact@).
- A **308** from http to https.

Then by hand:

- **App Store Connect:** open the app's Privacy Policy URL, Support URL and Marketing URL.
- **iPhone, Safari:** the Smart App Banner shows, the demo plays, the sticky bar works, and the footer links open.
- **Share preview:** send the link to yourself in Messages; the share image appears.
- **Google's Rich Results Test** on the real URL: it finds the Organization data. The FAQ and app results won't show (Google only shows FAQ results for government and health sites, and app results need ratings, which we don't add).

## After everything passes (wait at least an hour)

10. **Turn GitHub Pages off:** Settings → Pages → remove the custom domain, then unpublish (Source: **None**). Keep the `legacy-pages` branch for a few weeks as a backup.
11. **Cleanup PR:** remove `public/CNAME`, which only GitHub Pages used.
12. **Phase 4:** add the site to Google Search Console and Bing Webmaster Tools and submit `/sitemap.xml`.

## Later, with the app update that adds Purchase backup

- **App Store Connect → App Privacy:** update the privacy label. It can no longer say "Data Not Collected". Declare the optional backup email as Contact Info → Email Address, used for App Functionality, not used for tracking. It's tied to a purchase, so it most likely counts as linked to the user.

## If something goes wrong after step 8

Point the `amplii` CNAME back to `amplificiationinstitute.github.io`. Pages is still serving the frozen old site from `legacy-pages`, so it comes back within about 10 minutes. That's why turning Pages off is the very last step.
