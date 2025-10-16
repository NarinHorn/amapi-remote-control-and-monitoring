# Vercel Deployment Configuration

## Environment Variables
No environment variables are required for this project as it uses mock data.

## Build Settings
- Framework: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

## Deployment Steps

### Method 1: Vercel CLI (if PowerShell allows)
```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
vercel

# Follow the prompts:
# - Link to existing project? No
# - Project name: android-device-management
# - Directory: ./
# - Override settings? No
```

### Method 2: Vercel Dashboard (Recommended)
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub, GitLab, or Bitbucket
3. Click "New Project"
4. Import your Git repository
5. Vercel will auto-detect Next.js settings
6. Click "Deploy"

### Method 3: GitHub Integration
1. Push your code to GitHub
2. Connect GitHub account to Vercel
3. Import repository from Vercel dashboard
4. Deploy automatically on every push

## Project Structure
```
├── src/
│   ├── app/                 # Next.js App Router
│   ├── components/          # React components
│   ├── server/             # Mock API and data
│   └── types/              # TypeScript types
├── public/                 # Static assets
├── package.json           # Dependencies
├── next.config.ts         # Next.js config
├── tailwind.config.ts     # Tailwind CSS config
└── vercel.json           # Vercel deployment config
```

## Features Deployed
- ✅ Professional Dashboard
- ✅ Device Management Table
- ✅ Device Detail Pages
- ✅ Mock Google Maps Integration
- ✅ Real-time Telemetry (SSE)
- ✅ Remote Actions UI
- ✅ Command History
- ✅ Lost Mode Controls
- ✅ Location Tracking
- ✅ Compliance Monitoring

## Post-Deployment
After deployment, you can:
1. Replace mock APIs with real Spring Boot backend
2. Add Google Maps API key for real map integration
3. Configure environment variables for production
4. Set up custom domain (optional)
