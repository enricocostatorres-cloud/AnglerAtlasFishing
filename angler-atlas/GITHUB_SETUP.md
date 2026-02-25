# GitHub Setup Guide for Angler Atlas

## Initial Setup

### 1. Create Repository on GitHub

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `angler-atlas`
3. Description: "Strava-style social platform for fishing"
4. Choose Public or Private
5. Initialize with README (optional, we have one)
6. Click "Create repository"

### 2. Clone and Initialize Locally

```bash
# Clone if creating from existing repo
git clone https://github.com/YOUR_USERNAME/angler-atlas.git
cd angler-atlas

# Or initialize new repo
git init
git add remote origin https://github.com/YOUR_USERNAME/angler-atlas.git
```

### 3. Project Structure for GitHub

```
angler-atlas/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── api.js
├── .gitignore
├── README.md
└── SETUP.md
```

### 4. Create .gitignore

Create `.gitignore` in root:

```
# Dependencies
node_modules/
/.pnp
.pnp.js

# Environment variables
.env
.env.local
.env.*.local

# Build outputs
dist/
build/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*

# Testing
coverage/
.jest/

# Database
*.db
*.sqlite
```

Create `backend/.gitignore`:

```
node_modules/
.env
.env.local
npm-debug.log*
dist/
build/
```

## Git Workflow

### Initial Commit

```bash
# Stage all files
git add .

# Commit
git commit -m "Initial project setup: backend API, frontend, and documentation"

# Push to GitHub
git push -u origin main
```

### Feature Development

```bash
# Create feature branch
git checkout -b feature/catch-logging

# Make changes and commit
git add .
git commit -m "Add catch logging form and API integration"

# Push branch
git push origin feature/catch-logging

# Create Pull Request on GitHub
# -> Review and merge
```

### Common Commits

```bash
# New feature
git commit -m "Add: Google Maps integration for catch locations"

# Bug fix
git commit -m "Fix: User authentication token validation"

# Documentation
git commit -m "Docs: Update API endpoint documentation"

# Refactor
git commit -m "Refactor: Simplify API response handling"

# Dependencies
git commit -m "Deps: Update Express to v4.18.2"
```

## Branching Strategy

### Main Branches
- `main` - Production-ready code
- `develop` - Development/staging branch

### Feature Branches
- `feature/user-auth`
- `feature/catch-logging`
- `feature/leaderboard`
- `feature/google-maps`
- `feature/ecommerce`

### Bug Fix Branches
- `bugfix/login-issue`
- `bugfix/map-marker-display`

### Release Branches
- `release/v1.0.0`

## Development Workflow

### For Enrico:
```bash
# Create branch for your work
git checkout -b feature/user-dashboard

# Make changes
# Commit frequently
git commit -m "Add user profile card styling"

# Push to your branch
git push origin feature/user-dashboard

# Create PR for review
```

### For Paulo:
```bash
# Create branch for your work
git checkout -b feature/catch-form

# Make changes
# Commit frequently
git commit -m "Implement catch species selection dropdown"

# Push to your branch
git push origin feature/catch-form

# Create PR for review
```

## Merge Process

1. Create Pull Request on GitHub
2. Add description of changes
3. Team review
4. Approval and merge
5. Delete branch

## Keeping Branches Updated

```bash
# Fetch latest
git fetch origin

# Rebase on latest main
git rebase origin/main

# Or merge latest main
git merge origin/main
```

## Undoing Changes

```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Undo uncommitted changes
git checkout -- filename

# View commit history
git log --oneline
```

## Collaboration Tips

1. **Commit Often**: Small, logical commits are easier to review
2. **Write Clear Messages**: Help your teammate understand changes
3. **Pull Before Push**: Always pull latest changes before pushing
4. **Use Branches**: Never work directly on main
5. **Review Each Other's Code**: GitHub PRs for peer review

## GitHub Project Management

### Create a Project Board

1. Go to your GitHub repository
2. Click "Projects" tab
3. Create new project
4. Set up columns:
   - To Do
   - In Progress
   - Review
   - Done

### Create Issues

1. Go to "Issues" tab
2. Create new issue
3. Add labels: bug, feature, enhancement, documentation
4. Link to projects and branches

### Example Issues

- "User authentication system"
- "Google Maps integration"
- "Catch logging form validation"
- "Leaderboard ranking algorithm"
- "Mobile responsiveness"

## Useful GitHub Commands

```bash
# See branch status
git status

# See all branches
git branch -a

# Delete local branch
git branch -d feature/old-feature

# Delete remote branch
git push origin --delete feature/old-feature

# Rename branch
git branch -m old-name new-name

# Stash changes temporarily
git stash
git stash pop

# Cherry-pick a commit
git cherry-pick abc123
```

## CI/CD Setup (Optional)

Add GitHub Actions for automated testing:

Create `.github/workflows/test.yml`:

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm install
      - run: npm test
```

## Protection Rules (Optional)

1. Go to Settings → Branches
2. Add rule for `main`:
   - Require pull request reviews
   - Require status checks to pass
   - Require branches to be up to date

---

This ensures smooth collaboration and clean commit history!
