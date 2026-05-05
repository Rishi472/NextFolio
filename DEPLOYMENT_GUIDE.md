# 🚀 Deployment Guide - NEXXTFOLIO

Complete guide to deploy NEXXTFOLIO to production.

---

## 📋 Pre-Deployment Checklist

- [ ] All features tested locally
- [ ] Build completes without errors
- [ ] No console warnings or errors
- [ ] Responsive design tested (mobile, tablet, desktop)
- [ ] All links and buttons work
- [ ] Performance optimized
- [ ] Documentation updated
- [ ] Environment variables configured
- [ ] Database/backend ready (if applicable)

---

## 🏗️ Build Process

### 1. Create Production Build

```bash
cd client
npm run build
```

**Output**: Creates `dist/` folder with optimized files

```
dist/
├── index.html          (0.51 kB)
├── assets/
│   ├── index-[hash].css (2.41 kB gzip)
│   └── index-[hash].js  (76.99 kB gzip)
└── ...other assets
```

### 2. Preview Build Locally

```bash
npm run preview
```

Visit `http://localhost:4173/` to test production build locally

### 3. Verify Build

Check for:
- ✅ All pages load correctly
- ✅ No 404 errors
- ✅ Images display properly
- ✅ Styling matches dev version
- ✅ Interactions work smoothly
- ✅ Performance is acceptable

---

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

**Pros**: Zero-config deployment, automatic HTTPS, fast CDN

#### Setup & Deploy

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from client folder**
   ```bash
   cd client
   vercel
   ```

4. **Follow prompts**
   - Select project name
   - Confirm build settings
   - Deploy

5. **Access deployed site**
   ```
   https://your-project-name.vercel.app
   ```

#### Environment Variables (if needed)
```bash
vercel env add REACT_APP_API_URL
```

#### Redeploy
```bash
vercel --prod
```

---

### Option 2: Netlify

**Pros**: Easy setup, form submission handling, analytics included

#### Setup & Deploy

1. **Connect repository to Netlify**
   - Visit https://app.netlify.com/
   - Click "New site from Git"
   - Select GitHub/GitLab/Bitbucket
   - Choose your repository

2. **Configure build settings**
   - Build command: `cd client && npm run build`
   - Publish directory: `client/dist`
   - Node version: 18+

3. **Deploy**
   - Click "Deploy site"

4. **Access deployed site**
   ```
   https://your-site-name.netlify.app
   ```

#### Custom Domain
1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Follow DNS setup instructions

---

### Option 3: GitHub Pages

**Pros**: Free hosting, no extra account needed

#### Setup & Deploy

1. **Update vite.config.js**
   ```javascript
   export default {
     base: '/nextfolio/', // Change to your repo name
     // ... rest of config
   }
   ```

2. **Create GitHub workflow**
   
   Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy

   on:
     push:
       branches: [ main ]

   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - uses: actions/setup-node@v2
           with:
             node-version: '18'
         - run: cd client && npm install && npm run build
         - uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./client/dist
   ```

3. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Add deployment workflow"
   git push
   ```

4. **Access deployed site**
   ```
   https://your-username.github.io/nextfolio/
   ```

---

### Option 4: Docker + Cloud Deployment

#### Create Dockerfile

Create `Dockerfile` in `client/` folder:

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine

RUN npm install -g serve
WORKDIR /app
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

#### Build and Run Docker Image

```bash
# Build image
docker build -t nextfolio:latest .

# Run container
docker run -p 3000:3000 nextfolio:latest

# Push to registry
docker tag nextfolio:latest your-registry/nextfolio:latest
docker push your-registry/nextfolio:latest
```

#### Deploy to Cloud

**AWS ECS**:
```bash
# Push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin your-ecr-uri
docker tag nextfolio:latest your-ecr-uri/nextfolio:latest
docker push your-ecr-uri/nextfolio:latest
```

**Google Cloud Run**:
```bash
gcloud run deploy nextfolio --image gcr.io/your-project/nextfolio:latest
```

**Azure Container Instances**:
```bash
az container create --resource-group mygroup --name nextfolio --image your-registry/nextfolio:latest
```

---

## 🔧 Environment Configuration

### Environment Variables

Create `.env` file in `client/` folder:

```env
# API Configuration
REACT_APP_API_URL=https://api.example.com
REACT_APP_API_KEY=your_api_key

# AI Configuration
REACT_APP_OPENAI_KEY=your_openai_key

# Storage Configuration
REACT_APP_STORAGE_URL=https://storage.example.com

# Analytics
REACT_APP_GA_ID=UA-XXXXXXXXX-X
```

### Usage in Code

```javascript
const apiUrl = import.meta.env.REACT_APP_API_URL;
```

---

## ✅ Post-Deployment

### 1. Verify Deployment
- [ ] Site loads without errors
- [ ] All pages accessible
- [ ] Forms work correctly
- [ ] API calls successful (if configured)
- [ ] Images load properly
- [ ] Performance acceptable

### 2. Setup Domain (optional)
- Add custom domain
- Setup SSL certificate (usually automatic)
- Update DNS records

### 3. Analytics & Monitoring
```bash
# Add Google Analytics
npm install react-ga4
```

### 4. Security
- [ ] Enable HTTPS/SSL
- [ ] Setup CORS properly
- [ ] Secure API keys
- [ ] Setup rate limiting
- [ ] Enable security headers

### 5. Performance Testing
```bash
# Lighthouse test
# PageSpeed test
# WebPageTest
```

---

## 🔄 Update & Redeploy

### Vercel
```bash
git push                    # Pushes to connected repo
# Vercel automatically deploys
```

### Netlify
```bash
git push                    # Pushes to connected repo
# Netlify automatically deploys via webhook
```

### GitHub Pages
```bash
git push                    # Triggers GitHub workflow
# Workflow automatically deploys
```

---

## 🐛 Troubleshooting Deployment

### Issue: Build fails
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
npm run build
```

### Issue: 404 errors on routes
**Solution**: Configure redirect rules

**Vercel** (`vercel.json`):
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Netlify** (`_redirects`):
```
/* /index.html 200
```

### Issue: Google login shows `Error 400: origin_mismatch`
**Solution**: Register the deployed frontend origin on the OAuth client used by `VITE_GOOGLE_CLIENT_ID`.

1. Open Google Cloud Console -> APIs & Services -> Credentials.
2. Select the OAuth 2.0 Client ID used in Vercel.
3. Under **Authorized JavaScript origins**, add each frontend origin exactly, without a path:
   ```text
   http://localhost:5173
   https://next-folio-silk.vercel.app
   ```
4. Save, wait a few minutes, then retry Google login from the deployed URL.

For Google Identity Services popup login, the origin must match the browser URL's scheme, host, and port. Vercel preview URLs are unique, so either add each preview origin you test or use the stable production/custom domain for Google sign-in testing.

### Issue: CSS not loading
- Check Tailwind build output
- Verify CSS file size in dist/
- Check for CSS purging issues

### Issue: Images not displaying
- Verify image paths
- Check public folder configuration
- Test image compression

### Issue: Slow performance
```bash
# Analyze bundle size
npm install --save-dev webpack-bundle-analyzer

# Check lighthouse scores
# Optimize large modules
# Enable caching headers
```

---

## 📊 Monitoring

### Vercel Analytics
- Built-in analytics dashboard
- Real User Monitoring (RUM)
- Performance metrics

### Netlify Analytics
- Free analytics included
- Visitor breakdown
- Form submission tracking

### Google Analytics
```bash
npm install react-ga4
```

### Error Tracking
```bash
npm install @sentry/react
```

---

## 🔐 Security

### Environment Variables
Never commit `.env` to git:

```bash
# Add to .gitignore
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
```

### CORS Setup
Configure backend to accept requests from your domain:

```javascript
// Backend (Node.js example)
app.use(cors({
  origin: 'https://your-domain.com',
  credentials: true
}));
```

### API Key Protection
Never expose API keys in frontend code:

```javascript
// ❌ Wrong
const apiKey = 'sk_live_...'

// ✅ Right
const response = await fetch('/api/endpoint', {
  headers: { 'Authorization': 'Bearer ' + sessionToken }
});
```

---

## 📈 Performance Optimization

### Pre-Deployment
1. **Optimize bundle**
   ```bash
   npm run build -- --report
   ```

2. **Test Lighthouse**
   - Target: 90+ score
   - Check Performance, Accessibility, Best Practices, SEO

3. **Optimize images**
   - Compress images
   - Use WebP format
   - Implement lazy loading

### Post-Deployment
1. Enable caching
2. Enable compression (gzip)
3. Enable minification
4. Setup CDN
5. Monitor Core Web Vitals

---

## 🚀 Continuous Deployment

### GitHub Actions
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: cd client && npm install && npm run build
      - name: Deploy to Vercel
        run: vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

### GitLab CI
```yaml
deploy:
  stage: deploy
  script:
    - cd client
    - npm install
    - npm run build
    - vercel --prod --token $VERCEL_TOKEN
```

---

## 💰 Cost Estimation

| Platform | Monthly Cost | When |
|----------|-------------|------|
| Vercel | Free to $20+ | Free tier sufficient for most projects |
| Netlify | Free to $19+ | Free tier excellent |
| GitHub Pages | Free | Unlimited free sites |
| AWS | $0.50+ | Pay for bandwidth & storage |

---

## ✨ Deployment Checklist

Before going live:
- [ ] Build completes without errors
- [ ] Preview tested locally
- [ ] All features working
- [ ] Responsive design verified
- [ ] Performance acceptable
- [ ] Environment variables set
- [ ] Domain configured
- [ ] SSL certificate active
- [ ] Analytics setup (optional)
- [ ] Error tracking setup (optional)
- [ ] Monitoring configured
- [ ] Backup plan ready

---

## 📞 Support

- **Vercel Support**: https://vercel.com/help
- **Netlify Support**: https://docs.netlify.com/
- **GitHub Pages**: https://pages.github.com/

---

## 🎉 Deployment Complete!

Your Nextfolio application is now live! 🚀

**Next Steps**:
1. Monitor performance
2. Gather user feedback
3. Plan new features
4. Scale as needed

---

**Version**: 1.0
**Last Updated**: Current Session
**Status**: Ready to Deploy ✅
