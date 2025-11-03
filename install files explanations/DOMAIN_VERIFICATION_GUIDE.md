# 🌐 Domain Verification Setup (Alternative to Gmail App Passwords)

## Option 1: Set up email@mohamedshams.com

This is the **professional approach** and works better for production.

### Step 1: Add Domain to Resend

1. Login to **Resend Dashboard**: https://resend.com/domains
2. Click **"Add Domain"**
3. Enter: `mohamedshams.com`

### Step 2: Add DNS Records

Resend will give you DNS records to add. Log into your domain provider (where you bought mohamedshams.com) and add these records:

```dns
# SPF Record
Type: TXT
Name: @
Value: v=spf1 include:_spf.resend.com ~all

# DKIM Records  
Type: CNAME
Name: rs1._domainkey
Value: rs1.mohamedshams.com._domainkey.resend.com

Type: CNAME
Name: rs2._domainkey
Value: rs2.mohamedshams.com._domainkey.resend.com

# Domain Verification
Type: TXT
Name: _resend
Value: [Resend will provide this value]

# MX Record (optional, for receiving emails)
Type: MX
Name: @
Value: feedback-smtp.resend.com
Priority: 10
```

### Step 3: Verify Domain

1. After adding DNS records, wait 10-15 minutes
2. Click **"Verify Domain"** in Resend dashboard
3. Once verified ✅, you can send from any email@mohamedshams.com

### Step 4: Update Firebase Functions

Once verified, update your existing Resend functions:

```javascript
// In functions/index.js - update the 'from' field
from: 'Mohamed Shams <mohamed@mohamedshams.com>',
// or
from: 'Mohamed Shams <noreply@mohamedshams.com>',
```

## Option 2: Use Current Gmail + Resend (Hybrid)

Keep the current setup but with a professional sender name:

```javascript
from: 'Mohamed Shams <onboarding@resend.dev>',
reply_to: 'mohamedshams3467@gmail.com',
```

This way:
- ✅ Emails appear from "Mohamed Shams"
- ✅ Replies go to your Gmail
- ✅ No domain setup needed
- ✅ Works immediately

---

## 🤔 Which Option Do You Prefer?

1. **Keep trying Gmail App Password** (if you can enable 2FA)
2. **Set up domain verification** (professional, unlimited emails)
3. **Use hybrid approach** (current setup but refined)

Let me know which direction you'd like to go!
