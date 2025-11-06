# Dev Server Troubleshooting

## Nếu Dev Server Compile Quá Lâu (>5 phút)

### Solution 1: Kill và Restart

1. **Kill process hiện tại:**
   - Press `Ctrl + C` trong terminal
   - Hoặc close terminal và mở lại

2. **Clear cache:**
   ```powershell
   Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
   ```

3. **Restart:**
   ```powershell
   npm run dev
   ```

### Solution 2: Check for Errors

Nếu compile bị stuck, có thể có lỗi trong code. Check terminal output cho:
- TypeScript errors
- Import errors
- Missing dependencies

### Solution 3: Minimal Test

Tạm thời comment các imports phức tạp để test:

1. **Edit `app/layout.tsx`** - Comment OnchainKit:
```tsx
// import { OnchainKitProvider } from '@coinbase/onchainkit';
// import { base } from 'wagmi/chains';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* <OnchainKitProvider ...> */}
          {children}
        {/* </OnchainKitProvider> */}
      </body>
    </html>
  );
}
```

2. **Test với minimal page:**
```tsx
// app/page.tsx
export default function Home() {
  return <div>Test</div>;
}
```

3. **Nếu compile nhanh** → vấn đề là ở OnchainKit hoặc dependencies
4. **Nếu vẫn chậm** → vấn đề là Next.js config hoặc system

### Solution 4: Check System Resources

- **CPU**: Next.js compilation is CPU intensive
- **Memory**: Check if you have enough RAM
- **Disk**: Slow disk can cause slow compilation

### Solution 5: Use Turbopack (Experimental)

Next.js 15 có Turbopack (faster bundler):

```bash
npm run dev -- --turbo
```

## Expected Compile Times

- **First compile**: 30-60 seconds (normal)
- **Subsequent compiles**: 5-15 seconds (with cache)
- **If >5 minutes**: Something is wrong

## Quick Fixes

1. **Clear everything:**
   ```powershell
   Remove-Item -Recurse -Force .next, node_modules\.cache -ErrorAction SilentlyContinue
   npm run dev
   ```

2. **Check Node version:**
   ```bash
   node --version
   ```
   Should be Node 18+ (recommended: Node 20+)

3. **Reinstall dependencies:**
   ```bash
   Remove-Item -Recurse -Force node_modules
   npm install
   ```

