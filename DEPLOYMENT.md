# 🚀 Deployment Guide - Vercel

Complete step-by-step guide to deploy your Kenya Schools Training Map to Vercel.

---

## Why Vercel?

✅ **Free tier** - Perfect for this project  
✅ **Automatic deployments** - Push to Git, auto-deploy  
✅ **Fast global CDN** - Fast loading worldwide  
✅ **Easy setup** - 5 minutes to deploy  
✅ **Next.js optimized** - Built by Next.js creators  

---

## 📋 Prerequisites

- GitHub account (free)
- Vercel account (free - sign up at vercel.com)
- Your project folder ready

---

## 🎯 Deployment Steps

### Option A: Deploy via Vercel CLI (Fastest)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Navigate to your project
cd school-training-map

# 3. Login to Vercel
vercel login
# Follow the prompts to authenticate

# 4. Deploy!
vercel

# Answer the prompts:
# - Set up and deploy? Y
# - Which scope? Select your account
# - Link to existing project? N
# - Project name? school-training-map (or your choice)
# - Directory? ./ (just press Enter)
# - Override settings? N
```

**That's it!** Your app is now live! 🎉

Vercel will give you a URL like: `https://school-training-map.vercel.app`

---

### Option B: Deploy via Vercel Dashboard (Easier for beginners)

#### Step 1: Push to GitHub

```bash
# 1. Initialize Git (if not already done)
cd school-training-map
git init

# 2. Add all files
git add .

# 3. Commit
git commit -m "Initial commit - Kenya Schools Training Map"

# 4. Create a new repository on GitHub.com
# Go to: https://github.com/new
# Name: school-training-map
# Public or Private: Your choice
# Don't initialize with README

# 5. Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/school-training-map.git
git branch -M main
git push -u origin main
```

#### Step 2: Deploy to Vercel

1. **Go to Vercel:** https://vercel.com
2. **Click "Sign Up"** (use GitHub to sign in)
3. **Click "Add New Project"**
4. **Import your GitHub repository:**
   - Search for "school-training-map"
   - Click "Import"
5. **Configure Project:**
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build` (auto-filled)
   - Output Directory: `.next` (auto-filled)
6. **Add Environment Variable:**
   - Click "Environment Variables"
   - Name: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
   - Value: `AIzaSyCOHv-orP_3hbJWURDkVEq_cYK6U0Ii__M`
   - Click "Add"
7. **Click "Deploy"**

Wait 2-3 minutes... **Done!** 🎉

---

## 🔐 Post-Deployment: Secure Your API Key

**IMPORTANT:** Now that your site is live, restrict your Google Maps API key to your domain.

### Step 1: Get Your Vercel URL

After deployment, you'll have a URL like:
```
https://school-training-map.vercel.app
```

### Step 2: Restrict API Key in Google Cloud

1. Go to: https://console.cloud.google.com
2. Navigate to: **APIs & Services** → **Credentials**
3. Click on your API key
4. Under **Application restrictions:**
   - Select: **HTTP referrers (web sites)**
5. Click **Add an item** under Website restrictions
6. Add these referrers:
   ```
   https://school-training-map.vercel.app/*
   http://localhost:3000/*
   ```
   (Replace with your actual Vercel URL)
7. Click **Save**

Now your API key only works on your domains!

---

## 🔄 Automatic Deployments

With GitHub connected, every time you push changes:

```bash
# Make changes to your code
# Then:
git add .
git commit -m "Update map colors"
git push

# Vercel automatically deploys! ✨
```

Watch the deployment at: https://vercel.com/dashboard

---

## 🌐 Custom Domain (Optional)

Want to use your own domain like `schools.yourdomain.com`?

### Step 1: Add Domain in Vercel

1. Go to your project in Vercel dashboard
2. Click **Settings** → **Domains**
3. Enter your domain: `schools.yourdomain.com`
4. Click **Add**

### Step 2: Update DNS

Vercel will give you DNS records to add. Go to your domain registrar and add:

```
Type: CNAME
Name: schools
Value: cname.vercel-dns.com
```

Wait 24-48 hours for DNS propagation. Done!

---

## 📊 Monitoring & Analytics

### View Deployment Logs

1. Go to: https://vercel.com/dashboard
2. Click your project
3. Click any deployment
4. View build logs and runtime logs

### Check Performance

Vercel shows:
- Response times
- Bandwidth usage
- Function invocations

All in the dashboard!

---

## 🐛 Troubleshooting Deployment

### Build Failed

**Problem:** Build fails during deployment  
**Solution:**
1. Check build logs in Vercel dashboard
2. Common issues:
   - Missing dependencies → Run `npm install` locally first
   - TypeScript errors → Fix errors, commit, push
   - Missing files → Ensure all files are committed to Git

### Environment Variable Issues

**Problem:** Map not loading after deployment  
**Solution:**
1. Check Environment Variables in Vercel:
   - Settings → Environment Variables
   - Verify `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` exists
2. Redeploy: Deployments → Three dots → Redeploy

### API Key Restricted

**Problem:** "This API key is not authorized to use this service"  
**Solution:**
1. Check Google Cloud Console API restrictions
2. Make sure your Vercel URL is in the HTTP referrers list
3. Wait 5 minutes for changes to propagate

### Slow Loading

**Problem:** Map takes long to load  
**Solution:**
1. Check your region - Vercel auto-deploys to nearest region
2. Data files are small, shouldn't be the issue
3. Google Maps loading might be slow on first load (normal)

---

## 💰 Cost Estimate

### Vercel Costs
- **Hobby Plan:** FREE ✅
  - Unlimited deployments
  - 100 GB bandwidth/month
  - Automatic HTTPS
  - Perfect for this project!

### Google Maps API Costs
- **Free tier:** 28,000 map loads/month ✅
- Your usage: ~100-1000 loads/month
- **Cost:** $0 (well within free tier) ✅

**Total monthly cost: $0** 🎉

---

## 🔄 Rollback Deployments

Made a mistake? Easy to rollback!

1. Go to Vercel dashboard
2. Click **Deployments**
3. Find the last working deployment
4. Click three dots → **Promote to Production**

Done! Instant rollback.

---

## 📈 Scaling (If Needed)

If your map gets lots of traffic:

1. **Vercel automatically scales** - no action needed!
2. **Monitor usage** in dashboard
3. **Upgrade if needed** ($20/month for Pro plan)
   - Higher limits
   - Advanced analytics
   - But likely not needed for this project

---

## ✅ Deployment Checklist

Before deploying, make sure:

- [ ] All code is committed to Git
- [ ] `.env.local` is in `.gitignore` (yes, it is)
- [ ] Environment variable is set in Vercel
- [ ] Build succeeds locally: `npm run build`
- [ ] All data files are in `/public/data/`
- [ ] Google Maps API key is active

After deploying:

- [ ] Test the live URL
- [ ] Check all features work
- [ ] Restrict API key to your domain
- [ ] Share URL with stakeholders!

---

## 🎯 Quick Reference

### Vercel CLI Commands

```bash
# Deploy
vercel

# Deploy to production
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs

# Remove deployment
vercel remove
```

### Useful URLs

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Project Settings:** https://vercel.com/[username]/school-training-map/settings
- **Deployments:** https://vercel.com/[username]/school-training-map/deployments

---

## 🆘 Need Help?

- **Vercel Docs:** https://vercel.com/docs
- **Vercel Support:** https://vercel.com/support
- **Next.js Docs:** https://nextjs.org/docs

---

## 🎉 Success!

Once deployed, your Kenya Schools Training Map will be:

✅ **Live on the internet**  
✅ **Fast & reliable**  
✅ **Automatically updating** with Git pushes  
✅ **Free to host** on Vercel  
✅ **Secure** with HTTPS  
✅ **Scalable** to handle traffic  

**Share the URL with your team and start planning those training sessions!** 🎓

---

**Ready to deploy? Follow the steps above and you'll be live in 5 minutes!** 🚀
