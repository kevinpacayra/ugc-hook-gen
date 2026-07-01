# Deployment Guide

Deploy your UGC Hook Generator to production using Firebase Hosting + Cloud Run.

## Prerequisites

- Google Cloud Account
- Firebase Project
- Node.js and npm installed
- Firebase CLI (`npm install -g firebase-tools`)

## Step 1: Set Up Firebase Project

1. **Go to Firebase Console**
   - Visit https://console.firebase.google.com
   - Click "Add project"
   - Name it "ugc-hook-generator"
   - Enable Google Analytics (optional)
   - Click "Create project"

2. **Enable Services**
   - Go to "Hosting" → Enable Firebase Hosting
   - Go to "Functions" → Enable Cloud Functions

## Step 2: Prepare for Deployment

1. **Update your server.js for Cloud Functions**

Instead of `app.listen(PORT)`, use:
```javascript
const functions = require('firebase-functions');
exports.api = functions.https.onRequest(app);
```

2. **Create functions/index.js** with your server code

3. **Copy your .env variables to Firebase**
   - Go to Firebase Console → Functions → Runtime settings
   - Add environment variable: `ANTHROPIC_API_KEY=your_key_here`

## Step 3: Deploy

1. **Login to Firebase**
```bash
firebase login
```

2. **Initialize Firebase in your project**
```bash
firebase init
```
- Select "Hosting" and "Functions"
- Choose your project
- Keep default options

3. **Deploy**
```bash
firebase deploy
```

Your app will be live at: `https://your-project-id.firebaseapp.com`

## Step 4: Verify Deployment

1. Visit your Firebase hosting URL
2. Test all features:
   - Generate hooks
   - Save hooks
   - View history
   - Dark mode

## Environment Variables

Set your Anthropic API key in Firebase:

```bash
firebase functions:config:set anthropic.api_key="your_key_here"
```

## Troubleshooting

### API calls return 404
- Make sure Cloud Functions are deployed
- Check that `api` function is exported correctly

### API key not found
- Set environment variables in Firebase Console
- Redeploy functions: `firebase deploy --only functions`

### Cold starts (slow initial requests)
- Normal for Cloud Functions (first call takes longer)
- Subsequent calls are faster

## Scaling

Your app can handle:
- Unlimited concurrent users
- Auto-scales with demand
- Billed only for actual usage

## Cost

Firebase free tier includes:
- 5GB storage
- 1 GB/month outbound data
- 2 million function invocations/month
- Unlimited API calls

That's enough for most projects!

## Custom Domain (Optional)

1. Go to Firebase Hosting settings
2. Click "Add custom domain"
3. Follow domain verification steps
4. Update DNS records

## Monitor Performance

- Firebase Console → Hosting → Analytics
- View traffic, performance, errors
- Set up alerts for issues

## Next Steps

- Enable analytics to track usage
- Set up CI/CD with GitHub Actions
- Add monitoring and error reporting
- Plan scaling for growth
