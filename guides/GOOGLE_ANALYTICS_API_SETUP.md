# Google Analytics Setup Instructions

## Prerequisites

1. **Google Analytics GA4 Property** - Make sure you have a GA4 property set up for your website
2. **Service Account** - Create a Google Cloud Service Account with Analytics Reporting API access

## Setup Steps

### 1. Create Service Account (Google Cloud Console)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the "Google Analytics Reporting API"
4. Go to "IAM & Admin" > "Service Accounts"
5. Click "Create Service Account"
6. Fill in details and create
7. Click on the service account and go to "Keys" tab
8. Click "Add Key" > "Create New Key" > "JSON"
9. Download the JSON file and save it as `ga-credentials.json` in your project root

### 2. Grant Access to Analytics

1. Go to [Google Analytics](https://analytics.google.com/)
2. Select your GA4 property
3. Go to Admin > Property Access Management
4. Click "+" to add users
5. Add the service account email (from the JSON file) with "Viewer" permissions

### 3. Configure Environment Variables

Update your `.env` file with:

```env
# Get this from Google Analytics > Admin > Property > Property Details
GA_PROPERTY_ID=123456789

# Path to your service account JSON file
GA_CREDENTIALS_PATH=./ga-credentials.json
```

### 4. Run the Application

```bash
# Start both frontend and backend
npm run dev:full

# Or run separately:
# Backend (Terminal 1)
npm run server

# Frontend (Terminal 2)  
npm run dev
```

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/article-views?paths=/post/slug1,/post/slug2` - Get view counts

## Testing

The system includes fallback mock data, so even without proper GA setup, you'll see random view counts for testing.
