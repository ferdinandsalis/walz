# Automated Updates & CI/CD

This document describes the automated systems set up for the Walz website to handle dependency updates, security monitoring, and deployments - all using free GitHub features.

## 🤖 Automated Systems Overview

### 1. **Dependabot** - Dependency Updates
- **What**: GitHub's built-in dependency update service
- **Cost**: Free for public/private repos
- **Frequency**: Weekly on Mondays at 9:00 AM Vienna time
- **Scope**: NPM packages, Docker images, GitHub Actions

### 2. **GitHub Actions** - CI/CD Pipeline
- **What**: Automated testing, building, and deployment
- **Cost**: Free tier (2,000 minutes/month for private repos)
- **Triggers**: Push to main, pull requests
- **Features**: Auto-merge for safe updates

### 3. **Security Monitoring** - Vulnerability Scanning
- **What**: Automated security audits and alerts
- **Cost**: Free GitHub security features
- **Frequency**: Weekly + on package changes
- **Actions**: Creates issues for high/critical vulnerabilities

## 📋 Dependabot Configuration

### File: `.github/dependabot.yml`

```yaml
# Key features:
- Weekly updates on Mondays
- Grouped updates by ecosystem (React, testing, build tools, Sanity)
- React Router limited to patch updates only
- Automatic PR assignment and labeling
- Timezone: Europe/Vienna
```

### Update Strategy

| Package Type | Update Frequency | Auto-merge |
|--------------|------------------|------------|
| Security patches | Immediate | ✅ Yes |
| Patch updates | Weekly | ✅ Yes |
| Minor updates | Weekly | ✅ Yes* |
| Major updates | Weekly | ❌ Manual review |

*Except React Router packages (patch only)

### Ignored Updates
- **React Router**: Major & minor versions (breaking changes)
- **Node.js**: Major versions (infrastructure impact)

## 🔄 Auto-Merge Workflow

### File: `.github/workflows/dependabot-auto-merge.yml`

Automatically merges Dependabot PRs that meet criteria:

```yaml
Auto-merge conditions:
✅ Created by Dependabot
✅ All CI checks pass
✅ Patch updates (any package)
✅ Minor updates (except React Router)
❌ Major updates (manual review required)
❌ React Router minor/major updates
```

### Safety Features
- **CI Required**: Waits for full test suite to pass
- **Timeout**: 30-minute maximum wait for CI
- **Selective**: Only safe updates are auto-merged
- **Audit Trail**: All merges are logged and traceable

## 🚨 Security Monitoring

### File: `.github/workflows/security.yml`

Automated security auditing system:

### Weekly Security Audit
- **Schedule**: Every Monday at 9:00 AM Vienna time
- **Scope**: All dependencies and their sub-dependencies
- **Threshold**: High/critical vulnerabilities only
- **Action**: Creates GitHub issues for manual review

### Pull Request Security Review
- **Trigger**: Any PR that changes `package*.json`
- **Tool**: GitHub's Dependency Review Action
- **Behavior**: Blocks PRs with high-severity vulnerabilities
- **Comment**: Adds security summary to PR

### Vulnerability Response Process
1. **Detection**: Weekly scan finds vulnerability
2. **Issue Creation**: Automated GitHub issue with details
3. **Assessment**: Manual review of impact and fixes
4. **Resolution**: Update packages or find alternatives
5. **Verification**: Re-run audit to confirm fix

## 🏗️ CI/CD Pipeline (Existing)

Your existing `.github/workflows/deploy.yml` provides:

### Quality Checks
- **ESLint**: Code style and quality
- **TypeScript**: Type checking
- **Vitest**: Unit tests with coverage
- **Playwright**: E2E testing

### Deployment Process
- **Trigger**: Push to main branch
- **Requirements**: All tests must pass
- **Platform**: Fly.io deployment
- **Features**: Remote building, rollback capability

## 📊 Monitoring & Insights

### GitHub Insights (Free)
- **Dependency Graph**: Visual package relationships
- **Security Advisories**: CVE notifications
- **Dependabot Alerts**: Real-time vulnerability alerts
- **Actions Usage**: CI/CD minutes tracking

### Available Metrics
- Update frequency and success rates
- Security vulnerability trends
- CI/CD pipeline performance
- Deployment success/failure rates

## 🛠️ Setup & Configuration

### Initial Setup (One-time)

1. **Enable Dependabot** (if not auto-enabled):
   ```bash
   # Dependabot is enabled by the presence of .github/dependabot.yml
   ```

2. **Configure Branch Protection** (Recommended):
   ```
   GitHub Settings > Branches > Add rule for 'main':
   ✅ Require status checks to pass
   ✅ Require branches to be up to date
   ✅ Include administrators
   ```

3. **Set Repository Secrets** (if needed):
   ```
   GitHub Settings > Secrets and variables > Actions
   - FLY_API_TOKEN (already set)
   - Other service tokens (already set)
   ```

### Customization Options

#### Adjust Update Frequency
```yaml
# In .github/dependabot.yml
schedule:
  interval: "daily"    # Options: daily, weekly, monthly
  day: "monday"        # For weekly: monday-sunday
  time: "09:00"        # 24-hour format
```

#### Modify Auto-merge Rules
```yaml
# In .github/workflows/dependabot-auto-merge.yml
# Add more restrictive conditions:
if: |
  steps.metadata.outputs.update-type == 'version-update:semver-patch' &&
  !contains(steps.metadata.outputs.dependency-names, 'react') # Exclude React updates
```

#### Security Audit Sensitivity
```yaml
# In .github/workflows/security.yml
run: npm audit --audit-level=low  # Options: low, moderate, high, critical
```

## 🎯 Benefits & ROI

### Time Savings
- **Manual Updates**: ~2 hours/week → **Automated**: ~15 minutes/week
- **Security Monitoring**: Manual → Automatic with alerts
- **Deployment**: Manual → Automatic on merge

### Risk Reduction
- **Consistent Updates**: Never miss security patches
- **Tested Updates**: All updates pass full CI suite
- **Rollback Ready**: Easy revert if issues occur
- **Audit Trail**: Complete history of changes

### Maintenance Overhead
- **Setup**: One-time configuration (✅ Complete)
- **Monitoring**: Minimal - review auto-created issues
- **Maintenance**: Occasional workflow updates

## 🚫 Limitations & Considerations

### GitHub Actions Free Tier
- **Private Repos**: 2,000 minutes/month
- **Public Repos**: Unlimited
- **Current Usage**: ~200 minutes/week (well within limits)

### Manual Review Still Needed
- Major version updates
- React Router updates (minor/major)
- Security vulnerabilities requiring code changes
- Breaking changes in any package

### Rate Limits
- **Dependabot**: Max 5 open PRs at once
- **GitHub API**: Standard rate limits apply

## 🔧 Troubleshooting

### Common Issues

#### Dependabot PRs Not Auto-merging
```bash
# Check workflow logs:
GitHub Actions tab > dependabot-auto-merge workflow

# Common causes:
- CI checks failed
- Update type doesn't meet criteria
- Branch protection rules blocking
```

#### Security Audit False Positives
```bash
# Manually audit specific package:
npm audit --json | jq '.vulnerabilities.PACKAGE_NAME'

# Override if false positive:
npm audit --audit-level=high --production
```

#### CI Minutes Running Low
```bash
# Check usage:
GitHub Settings > Billing > Actions

# Optimize by:
- Running fewer E2E tests on dependencies
- Using self-hosted runners (advanced)
```

## 📈 Future Enhancements (Optional)

### Performance Monitoring
- **Lighthouse CI**: Automated performance testing
- **Bundle Analysis**: Track bundle size changes

### Advanced Security
- **CodeQL**: Static code analysis
- **Container Scanning**: Docker image vulnerability scanning

### Notifications
- **Slack Integration**: Update notifications
- **Email Alerts**: Critical security issues

---

This automation setup provides enterprise-grade dependency management and security monitoring using only free GitHub features, saving significant maintenance time while improving security posture.