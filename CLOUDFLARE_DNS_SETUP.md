# 🌐 Cloudflare DNS Setup for mohamedshams.com

## Step 1: Add Domain to Resend (Do This First)

1. Go to: https://resend.com/domains
2. Click **"Add Domain"**
3. Enter: `mohamedshams.com`
4. Click **"Add Domain"**

Resend will then show you the exact DNS records to add.

## Step 2: Add DNS Records in Cloudflare

### Access Cloudflare DNS:
1. Login to: https://dash.cloudflare.com/
2. Click on **mohamedshams.com** domain
3. Go to **DNS** → **Records**

### Add Each Record Type:

#### SPF Record (Email Authorization)
- **Type**: TXT
- **Name**: @ (or mohamedshams.com)
- **Content**: `v=spf1 include:_spf.resend.com ~all`
- **Proxy status**: DNS only (gray cloud)
- **TTL**: Auto

#### DKIM Record 1 (Email Authentication)
- **Type**: CNAME
- **Name**: `rs1._domainkey`
- **Target**: `rs1.mohamedshams.com._domainkey.resend.com`
- **Proxy status**: DNS only (gray cloud)
- **TTL**: Auto

#### DKIM Record 2 (Email Authentication)
- **Type**: CNAME
- **Name**: `rs2._domainkey`
- **Target**: `rs2.mohamedshams.com._domainkey.resend.com`
- **Proxy status**: DNS only (gray cloud)
- **TTL**: Auto

#### Domain Verification (Resend will provide exact value)
- **Type**: TXT
- **Name**: `_resend`
- **Content**: [Copy exactly from Resend dashboard]
- **Proxy status**: DNS only (gray cloud)
- **TTL**: Auto

#### Optional: MX Record (for receiving emails)
- **Type**: MX
- **Name**: @ (or mohamedshams.com)
- **Mail server**: `feedback-smtp.resend.com`
- **Priority**: 10
- **Proxy status**: DNS only (gray cloud)
- **TTL**: Auto

## Step 3: Important Cloudflare Settings

### ⚠️ CRITICAL: Use "DNS Only" (Gray Cloud)
- **DO NOT** use "Proxied" (orange cloud) for email records
- Email records must be "DNS only" to work properly
- Click the cloud icon to make it gray

### Cloudflare Screenshot Guide:
```
DNS Records should look like this:

Type    Name              Content                                          Proxy Status
TXT     @                 v=spf1 include:_spf.resend.com ~all             DNS only ☁️
CNAME   rs1._domainkey    rs1.mohamedshams.com._domainkey.resend.com     DNS only ☁️
CNAME   rs2._domainkey    rs2.mohamedshams.com._domainkey.resend.com     DNS only ☁️
TXT     _resend           [value from Resend]                             DNS only ☁️
MX      @                 feedback-smtp.resend.com (Priority: 10)        DNS only ☁️
```

## Step 4: Verify Domain

1. **Wait 5-10 minutes** (Cloudflare is usually fast)
2. Go back to Resend dashboard
3. Click **"Verify Domain"** next to mohamedshams.com
4. ✅ Should show "Verified" status

## Step 5: Test DNS Propagation

You can check if DNS records are working:
- SPF: `nslookup -type=TXT mohamedshams.com`
- DKIM: `nslookup -type=CNAME rs1._domainkey.mohamedshams.com`

## 🚨 Common Issues & Solutions

### Issue: "Domain not verified"
- **Solution**: Make sure all records are "DNS only" (gray cloud)
- Wait longer for DNS propagation
- Double-check record names and values

### Issue: Records not propagating
- **Solution**: Check TTL is set to Auto or 300 seconds
- Cloudflare sometimes caches old records

### Issue: MX record conflicts
- **Solution**: If you have existing MX records, you can skip the MX record
- Only needed if you want to receive emails at your domain

---

## 📋 Checklist

- [ ] Add domain to Resend dashboard
- [ ] Copy exact DNS records from Resend
- [ ] Add SPF record (TXT) to Cloudflare
- [ ] Add DKIM records (CNAME) to Cloudflare  
- [ ] Add verification record (TXT) to Cloudflare
- [ ] Set all records to "DNS only" (gray cloud)
- [ ] Wait 5-10 minutes
- [ ] Verify domain in Resend
- [ ] Deploy updated Firebase Functions

**Next**: Add the domain to Resend first, then share the exact DNS records they give you!
