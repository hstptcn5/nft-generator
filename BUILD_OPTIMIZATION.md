# Build Optimization

## Quick Build (Recommended for Testing)

Build đã được tối ưu để bỏ qua type checking và ESLint:

```bash
npm run build
```

**Lưu ý:** Type checking đã được skip trong build để tăng tốc. Check types riêng nếu cần:

```bash
npm run type-check
```

## Build Performance Tips

### 1. Clear Cache
Nếu build vẫn chậm, clear cache:

```bash
# Windows PowerShell
Remove-Item -Recurse -Force .next
npm run build

# Linux/Mac
rm -rf .next
npm run build
```

### 2. Development Mode (Fastest)
Để test nhanh, dùng dev mode:

```bash
npm run dev
```

Dev mode không build production bundle, nhanh hơn nhiều.

### 3. Check Types Separately
Type checking riêng (không block build):

```bash
npm run type-check
```

### 4. Why Build is Slow?

- **Next.js 15 + React 19**: New features, slower compilation
- **TypeScript**: Type checking (now skipped in build)
- **Large codebase**: Many files to process
- **First build**: No cache, slower

**Subsequent builds** will be faster due to caching.

## Production Build

Khi deploy production, nên check types trước:

```bash
npm run type-check
npm run build
```

## Troubleshooting

### Build Still Slow?
1. Check CPU usage - Next.js is CPU intensive
2. Close other apps
3. Use `npm run dev` for testing instead
4. Consider upgrading Node.js version

### Memory Issues?
Add to `.env.local`:
```
NODE_OPTIONS=--max-old-space-size=4096
```

