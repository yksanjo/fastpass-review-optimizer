# 🚀 GitHub Setup Guide

Follow these steps to get FastPass on GitHub and deploy it live!

## Step 1: Create GitHub Repository

1. Go to [https://github.com/new](https://github.com/new)
2. Repository name: `fastpass-review-optimizer`
3. Description: `Smart code review queue manager that prioritizes PRs based on your expertise`
4. Make it **Public** (so others can use it!)
5. ✅ Check "Add a README file" (we'll replace it)
6. Click **"Create repository"**

## Step 2: Initialize Git and Push

```bash
# Navigate to the project directory
cd /Users/yoshikondo/fastpass-review-optimizer

# Initialize git (if not already done)
git init

# Add all files
git add .

# Make your first commit
git commit -m "Initial FastPass implementation - Smart code review queue manager"

# Add your GitHub repository as remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/fastpass-review-optimizer.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Install Dependencies

```bash
# Make sure you're in the project directory
cd /Users/yoshikondo/fastpass-review-optimizer

# Install all dependencies
npm install
```

## Step 4: Test Locally

```bash
# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. You should see FastPass running!

## Step 5: Deploy to GitHub Pages (Optional)

Make your app accessible online:

### 5.1 Update package.json

Edit `package.json` and replace `YOUR_USERNAME` with your GitHub username:

```json
"homepage": "https://YOUR_USERNAME.github.io/fastpass-review-optimizer"
```

### 5.2 Deploy

```bash
# Build and deploy to GitHub Pages
npm run deploy
```

### 5.3 Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select:
   - Branch: `gh-pages`
   - Folder: `/ (root)`
4. Click **Save**

Your live demo will be at: `https://YOUR_USERNAME.github.io/fastpass-review-optimizer`

## Step 6: Update README (Optional)

Edit `README.md` and replace `YOUR_USERNAME` with your actual GitHub username in:
- Clone URL
- GitHub Pages URL (if deployed)

## 🎉 You're Done!

Your FastPass project is now:
- ✅ On GitHub
- ✅ Ready for others to fork and use
- ✅ Deployed live (if you did Step 5)

## Next Steps

- Add GitHub API integration for real PR data
- Add authentication for private repos
- Customize the priority algorithm
- Add more review platforms (GitLab, Bitbucket)

## Troubleshooting

### "npm: command not found"
Install Node.js from [nodejs.org](https://nodejs.org/)

### "Permission denied" when pushing
Make sure you're authenticated with GitHub:
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Build fails
Make sure all dependencies are installed:
```bash
rm -rf node_modules package-lock.json
npm install
```

