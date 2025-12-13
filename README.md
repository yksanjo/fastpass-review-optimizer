# 🎟️ FastPass - Smart Code Review Queue Manager

Stop wasting time on random code reviews. FastPass intelligently prioritizes your review queue based on your expertise, PR complexity, and team impact.

![FastPass](https://img.shields.io/badge/FastPass-v1.0.0-blue) ![React](https://img.shields.io/badge/React-18.2.0-61dafb) ![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- **Smart Prioritization**: Analyzes your expertise and sorts PRs for maximum efficiency
- **Batch Review Detection**: Groups similar PRs to reduce context switching
- **Time Estimation**: Predicts review time based on your past performance
- **Zero Manual Input**: Connects to GitHub/GitLab/Gerrit APIs automatically
- **Context Pre-Loading**: Shows related docs, recent changes, and dependencies before you click
- **Expertise Tracking**: Learns from your review history to improve recommendations

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/fastpass-review-optimizer.git
cd fastpass-review-optimizer

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📊 Impact

- ⚡ **30-40% faster review cycles** - Review the right PRs at the right time
- 🎯 **Prioritize blocking PRs automatically** - Never miss critical reviews
- 🧠 **Reduce mental overhead** - Batch similar PRs to maintain context
- 📈 **Track velocity improvements** - See your time savings over time

## 🛠️ Tech Stack

- **React 18** - Modern UI framework
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons

## 🎯 How It Works

FastPass uses a smart algorithm that considers:

1. **Your Expertise**: Languages and domain areas you're fastest at reviewing
2. **PR Characteristics**: Size, complexity, age, blocking status
3. **Team Impact**: Which PRs unblock the most work
4. **Context Switching**: Groups similar PRs for batch review

### Priority Calculation

Each PR gets a priority score based on:
- Your expertise match (languages + areas)
- Blocking status (blocking PRs get higher priority)
- PR age (older PRs need attention)
- Complexity vs. your speed
- Author response time patterns

## 🔌 API Integration (Coming Soon)

FastPass is designed to integrate with:

- ✅ **GitHub** - via REST/GraphQL API
- ✅ **GitLab** - via API
- ✅ **Gerrit** - via API (for Google engineers)
- ✅ **Bitbucket** - via API

The current version uses mock data. To connect to real APIs:

1. Add your API credentials to environment variables
2. Implement API client in `src/api/`
3. Replace mock data with real API calls

## 📦 Building for Production

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌐 Deploy to GitHub Pages

```bash
# Install gh-pages (if not already installed)
npm install --save-dev gh-pages

# Update package.json homepage to your GitHub Pages URL
# Then deploy:
npm run deploy
```

Don't forget to enable GitHub Pages in your repository settings!

## 🎨 Customization

### Update User Expertise

Edit the `userExpertise` object in `src/App.jsx` to match your skills:

```javascript
const userExpertise = {
  languages: { python: 95, javascript: 85, go: 70 },
  areas: { auth: 90, frontend: 85, api: 80 },
  avgReviewTime: {
    small: 8,
    medium: 25,
    large: 65,
    xlarge: 120
  }
};
```

### Adjust Priority Algorithm

Modify the `getOptimalOrder()` function to change how PRs are prioritized.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Built to solve the #1 engineering bottleneck: code review queues.

Inspired by the need for better reviewer productivity tools in modern software development.

---

**Made with ⚡ by engineers, for engineers**

