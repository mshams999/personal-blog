# 🌐 Domain Setup: mohamed@mohamedshams.com

## Step 1: Add Domain to Resend ✅

1. Go to: https://resend.com/domains
2. Click **"Add Domain"**
3. Enter: `mohamedshams.com`
4. Click **"Add Domain"**

Resend will then show you DNS records to add.

## Step 2: Add DNS Records

After adding the domain, Resend will provide DNS records that look like this:

### Typical DNS Records (yours may be different):

```dns
# SPF Record - Allows Resend to send emails from your domain
Type: TXT
Name: @ (or leave blank)
Value: v=spf1 include:_spf.resend.com ~all

# DKIM Records - Email authentication
Type: CNAME  
Name: rs1._domainkey
Value: rs1.mohamedshams.com._domainkey.resend.com

Type: CNAME
Name: rs2._domainkey  
Value: rs2.mohamedshams.com._domainkey.resend.com

# Domain Verification - Proves you own the domain
Type: TXT
Name: _resend
Value: [Specific value provided by Resend - copy exactly]

# Optional: MX Record (if you want to receive emails)
Type: MX
Name: @ (or leave blank)
Value: feedback-smtp.resend.com
Priority: 10
```

## Step 3: Where to Add DNS Records

You need to add these records where you manage your domain. Common providers:

### Namecheap:
1. Login to Namecheap
2. Go to Domain List → Manage
3. Advanced DNS → Add Record

### GoDaddy:
1. Login to GoDaddy
2. My Products → Domains → DNS
3. Add Record

### Cloudflare:
1. Login to Cloudflare
2. Select your domain
3. DNS → Records → Add record

### Google Domains:
1. Login to Google Domains
2. My domains → Manage
3. DNS → Custom records

## Step 4: Verify Domain

After adding DNS records:
1. **Wait 10-15 minutes** for DNS propagation
2. Go back to Resend dashboard
3. Click **"Verify Domain"** next to mohamedshams.com
4. If verification fails, wait longer or check DNS records

## Step 5: Deploy Updated Functions

Once domain is verified, deploy the updated Firebase Functions:

```bash
cd d:\new
firebase deploy --only functions
```

## 🎯 What You'll Get

✅ **Professional emails from**: mohamed@mohamedshams.com  
✅ **No daily limits** (unlike Gmail)  
✅ **Better deliverability** (your own domain)  
✅ **Professional appearance** in recipient's inbox  
✅ **Scalable** for growing your newsletter  

## 📋 Checklist

- [ ] Add domain to Resend
- [ ] Copy DNS records from Resend
- [ ] Add DNS records to your domain provider
- [ ] Wait for DNS propagation (10-15 mins)
- [ ] Verify domain in Resend
- [ ] Deploy updated Firebase Functions
- [ ] Test sending emails

---

**Next**: After you've added the domain to Resend, share the DNS records they give you and let me know which domain provider you use (Namecheap, GoDaddy, etc.)!
