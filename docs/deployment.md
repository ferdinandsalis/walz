# Deployment Guide

## 🚀 Production Deployment on Fly.io

The Walz website is deployed on [Fly.io](https://fly.io) using Docker containers with automatic deployment from the main branch.

### Current Deployment Status
- **Platform**: Fly.io
- **Region**: CDG (Paris)
- **URL**: https://walz.at
- **SSL**: Automatic Let's Encrypt certificates
- **Health Checks**: Enabled at `/resources/healthcheck`

## 🏗️ Build & Deployment Process

### Automatic Deployment
```bash
# Triggered automatically on push to main branch
git push origin main

# Manual deployment
npm run deploy
```

### Build Pipeline
1. **Install Dependencies**: `npm ci --only=production`
2. **Type Generation**: `sanity typegen generate` 
3. **Build React Router**: `npm run build:react-router`
4. **Build Server**: `npm run build:server`
5. **Docker Image Creation**: Multi-stage Docker build
6. **Deploy to Fly.io**: Container deployment with health checks

## 🐳 Docker Configuration

### Multi-Stage Dockerfile
```dockerfile
# Build stage
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production --silent

# Runtime stage  
FROM node:22-alpine AS runtime
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

COPY --from=builder --chown=nodejs:nodejs /app/node_modules /app/node_modules
COPY --chown=nodejs:nodejs . /app

USER nodejs
WORKDIR /app

EXPOSE 8080
ENV PORT="8080"
ENV NODE_ENV="production"

CMD ["npm", "start"]
```

### Docker Optimization
- **Multi-stage build** reduces final image size
- **Node user** for security (non-root execution)
- **Alpine Linux** for minimal attack surface
- **Layer caching** for faster rebuilds

## ⚙️ Fly.io Configuration

### fly.toml Configuration
```toml
app = "walz"
primary_region = "cdg"
kill_signal = "SIGINT"
kill_timeout = "5s"
swap_size_mb = 512

[experimental]
auto_rollback = true

[[services]]
protocol = "tcp"
internal_port = 8080
processes = ["app"]

[services.concurrency]
hard_limit = 100
soft_limit = 80
type = "requests"

[[services.ports]]
handlers = ["http"]
port = 80
force_https = true

[[services.ports]]
handlers = ["tls", "http"]
port = 443

[[services.tcp_checks]]
grace_period = "1s"
interval = "15s"
restart_limit = 0
timeout = "2s"

[[services.http_checks]]
interval = "10s"
grace_period = "5s"
method = "get"
path = "/resources/healthcheck"
protocol = "http"
timeout = "2s"
```

### Key Configuration Features
- **Auto-rollback**: Automatic rollback on deployment failure
- **Health checks**: HTTP and TCP monitoring
- **HTTPS enforcement**: Automatic redirect from HTTP
- **Concurrency limits**: Request throttling protection
- **European region**: CDG (Paris) for optimal performance

## 🔧 Environment Configuration

### Production Environment Variables
```bash
# Required for production
NODE_ENV=production
PORT=8080

# Sanity CMS
SANITY_PUBLIC_PROJECT_ID=iaejvb99
SANITY_PUBLIC_DATASET=production
SANITY_PUBLIC_API_VERSION=2023-10-01

# External services
SENTRY_DSN=https://...
GOOGLE_MAPS_API_KEY=AIza...
BUTTONDOWN_API_KEY=...
HONEYPOT_SECRET=...
```

### Environment Management
- **Fly secrets**: Sensitive values stored securely
- **Public variables**: Non-sensitive config in fly.toml
- **Local development**: Uses mise.toml (gitignored)

### Setting Secrets
```bash
# Set production secrets
fly secrets set SENTRY_DSN="https://..."
fly secrets set HONEYPOT_SECRET="..."

# List current secrets
fly secrets list

# Remove a secret
fly secrets unset SECRET_NAME
```

## 📊 Monitoring & Observability

### Health Monitoring
```typescript
// app/routes/resources+/healthcheck.ts
export async function loader() {
  const host = process.env.FLY_APP_NAME ? 
    `${process.env.FLY_APP_NAME}.fly.dev` : 
    'localhost:3000'
    
  try {
    // Check database connectivity
    await sanityClient.fetch('*[_type == "post"][0]')
    
    return new Response('OK', { 
      status: 200,
      headers: { 'Cache-Control': 'no-cache' }
    })
  } catch (error) {
    console.error('Health check failed:', error)
    return new Response('Service Unavailable', { status: 503 })
  }
}
```

### Error Tracking
- **Sentry Integration**: Real-time error monitoring
- **Performance Monitoring**: Transaction tracking
- **Release Tracking**: Deployment correlation

### Analytics
- **Plausible Analytics**: Privacy-focused visitor tracking
- **Core Web Vitals**: Performance monitoring
- **Custom Events**: User interaction tracking

## 🔄 Deployment Workflows

### Development to Production
```bash
# 1. Feature development
git checkout -b feature/new-feature
# ... make changes ...
git commit -m "feat: add new feature"

# 2. Testing
npm run validate        # Run all tests and checks
npm run test:e2e:run    # E2E tests

# 3. Deploy to production
git checkout main
git merge feature/new-feature
git push origin main    # Triggers automatic deployment
```

### Emergency Rollback
```bash
# Quick rollback to previous version
fly releases list
fly releases rollback <version-number>

# Check rollback status
fly status
```

### Zero-Downtime Deployment
Fly.io provides zero-downtime deployments through:
- **Health checks**: New instances must pass health checks
- **Graceful shutdown**: 5-second graceful shutdown period  
- **Traffic migration**: Automatic traffic routing to healthy instances

## 🔒 Security Configuration

### SSL/TLS
- **Automatic certificates**: Let's Encrypt integration
- **HTTPS enforcement**: Force redirect from HTTP
- **HSTS headers**: HTTP Strict Transport Security
- **Certificate renewal**: Automatic renewal process

### Network Security
```bash
# Firewall rules (managed by Fly.io)
- Port 80: HTTP (redirects to HTTPS)
- Port 443: HTTPS (application traffic)
- Port 8080: Internal (application container)
```

### Application Security
- **Rate limiting**: Express rate limiter
- **CSRF protection**: Honeypot implementation
- **Content Security Policy**: Strict CSP headers
- **Secure headers**: X-Frame-Options, X-Content-Type-Options

## 📈 Performance Optimization

### CDN & Caching
- **Fly.io CDN**: Global edge caching
- **Static assets**: Long-term browser caching
- **Sanity CDN**: Image optimization and caching
- **HTTP caching**: Appropriate cache headers

### Database Optimization
- **Sanity CDN**: Global content distribution
- **Query optimization**: Efficient GROQ queries
- **Image optimization**: Automatic WebP/AVIF conversion
- **Lazy loading**: Deferred content loading

### Build Optimization
```json
{
  "build:react-router": "NODE_OPTIONS=--max-old-space-size=8192 react-router build"
}
```
- **Memory allocation**: Increased heap size for large builds
- **Code splitting**: Automatic route-based splitting
- **Bundle optimization**: Tree shaking and minification
- **Asset optimization**: Image and font optimization

## 🚨 Troubleshooting

### Common Deployment Issues

#### Build Failures
```bash
# Check build logs
fly logs --app walz

# Common fixes
npm run typecheck      # Fix TypeScript errors
npm run lint          # Fix linting issues  
npm run test          # Fix failing tests
```

#### Runtime Errors
```bash
# Check application logs
fly logs --app walz --tail

# Check health status
fly status

# Restart application
fly restart
```

#### Environment Issues
```bash
# Verify secrets
fly secrets list

# Check environment in logs
fly logs --search "ENV"

# Update secrets
fly secrets set KEY="new-value"
```

### Monitoring Commands
```bash
# Real-time logs
fly logs --tail

# Application metrics
fly metrics

# Machine status
fly status

# Scale application
fly scale count 2    # Scale to 2 instances
fly scale memory 512 # Scale memory to 512MB
```

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] All tests passing (`npm run validate`)
- [ ] TypeScript compilation successful
- [ ] Environment variables configured
- [ ] Sanity schema deployed
- [ ] Content reviews completed

### During Deployment
- [ ] Monitor deployment logs (`fly logs --tail`)
- [ ] Verify health checks passing
- [ ] Test critical user paths
- [ ] Confirm analytics tracking

### Post-Deployment
- [ ] Smoke test all major functionality  
- [ ] Check error rates in Sentry
- [ ] Monitor performance metrics
- [ ] Verify SSL certificate validity
- [ ] Update documentation if needed

## 🆘 Emergency Procedures

### Service Outage Response
1. **Assess Impact**: Check health dashboard
2. **Quick Rollback**: `fly releases rollback` if recent deployment
3. **Scale Resources**: `fly scale` if resource constraint
4. **Communication**: Update stakeholders
5. **Root Cause Analysis**: Investigate and document

### Data Recovery
- **Sanity Backups**: Automatic daily backups
- **Version Control**: All code changes tracked
- **Database Restore**: Contact Sanity support if needed

This deployment configuration provides a robust, scalable, and secure hosting solution for the Walz website with comprehensive monitoring and quick recovery capabilities.