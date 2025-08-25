# Food label system

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/weedsungs-projects/v0-food-label-system)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/WmqAP6JXM5y)

## Overview

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## Backend Configuration

The application is configured to use the Railway production backend:

**Backend URL:** `https://foodlaw-production-e1f3.up.railway.app`

All API calls are directed to this production server. The configuration is centralized in:
- `lib/config.ts` - Central configuration file
- `axiosConfig.ts` - Axios instance configuration
- `lib/axiosConfig.ts` - Alternative axios configuration

## Deployment

Your project is live at:

**[https://vercel.com/weedsungs-projects/v0-food-label-system](https://vercel.com/weedsungs-projects/v0-food-label-system)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/projects/WmqAP6JXM5y](https://v0.app/chat/projects/WmqAP6JXM5y)**

## How It Works

1. Create and modify your project using [v0.dev](https://v0.dev)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

## Troubleshooting

### Build Issues

If you encounter build issues related to dependency mismatches:

1. **Lockfile Issues**: Delete `pnpm-lock.yaml` and `package-lock.json` files
2. **Reinstall Dependencies**: Run `pnpm install` to regenerate lockfiles
3. **Vercel Build**: The project includes `vercel.json` with optimized build settings

### Development Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### React 18 Compatibility

This project uses React 18.3.1 for better compatibility with vaul@0.9.9 and other dependencies.
