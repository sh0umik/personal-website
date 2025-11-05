# Custom Domain Setup for shoumik.me

## Step 1: Configure GitHub Pages Custom Domain

1. Go to: https://github.com/sh0umik/personal-website/settings/pages
2. Under "Custom domain", enter: `shoumik.me`
3. Check "Enforce HTTPS" (recommended)
4. Click **Save**

GitHub will automatically create a CNAME record. Wait a few minutes for DNS propagation.

## Step 2: Configure Cloudflare DNS

In your Cloudflare dashboard (https://dash.cloudflare.com/ed3b172a76f48c5ae3cffca0de8b9417/shoumik.me/dns/records):

### For Root Domain (shoumik.me):

Add/Update these DNS records:

1. **A Record** (if not exists):
   - Name: `@` (or `shoumik.me`)
   - Content: `185.199.108.153`
   - Proxy status: **DNS only** (gray cloud - not proxied)
   - TTL: Auto

2. **A Record**:
   - Name: `@` (or `shoumik.me`)
   - Content: `185.199.109.153`
   - Proxy status: **DNS only**
   - TTL: Auto

3. **A Record**:
   - Name: `@` (or `shoumik.me`)
   - Content: `185.199.110.153`
   - Proxy status: **DNS only**
   - TTL: Auto

4. **A Record**:
   - Name: `@` (or `shoumik.me`)
   - Content: `185.199.111.153`
   - Proxy status: **DNS only**
   - TTL: Auto

**OR** use CNAME instead (recommended):

1. **CNAME Record**:
   - Name: `@` (or `shoumik.me`)
   - Content: `sh0umik.github.io`
   - Proxy status: **DNS only** (gray cloud - not proxied)
   - TTL: Auto

**Important**: Make sure Cloudflare proxy is **OFF** (gray cloud) for GitHub Pages. GitHub Pages doesn't work well with Cloudflare's proxy.

### For www subdomain (optional):

1. **CNAME Record**:
   - Name: `www`
   - Content: `shoumik.me`
   - Proxy status: **DNS only**
   - TTL: Auto

## Step 3: Wait for DNS Propagation

- DNS changes can take 24-48 hours to fully propagate
- Usually works within 5-30 minutes
- Check DNS propagation: https://dnschecker.org/#A/shoumik.me

## Step 4: Verify Setup

1. After DNS propagates, go back to GitHub Pages settings
2. GitHub should show "Domain is properly configured" with a green checkmark
3. Visit https://shoumik.me to verify your site is live

## Troubleshooting

- If site doesn't load: Wait for DNS propagation (can take up to 48 hours)
- If you see Cloudflare error: Make sure proxy is OFF (gray cloud)
- If you see 404: Check that GitHub Pages is enabled and the workflow completed successfully
- To check SSL: GitHub Pages automatically provides SSL certificates for custom domains

## Cloudflare SSL/TLS Settings

In Cloudflare dashboard:
1. Go to SSL/TLS settings
2. Set encryption mode to **Full** or **Full (strict)**
3. This ensures HTTPS works properly with GitHub Pages

## Notes

- The CNAME file in `public/CNAME` will be automatically deployed
- Next.js will automatically detect custom domain and remove basePath
- GitHub Pages will handle SSL certificate automatically
- Make sure Cloudflare proxy is OFF for GitHub Pages to work correctly

