# Pre-Commit Checklist

Review this checklist before pushing to Git to ensure no sensitive files are committed.

## Critical - Never Commit These

- [ ] `.env` files (any `.env*` file)
- [ ] `.env.local`
- [ ] `contracts/.env`
- [ ] Private keys (any files containing `PRIVATE_KEY`, `privateKey`, `0x...`)
- [ ] CDP API keys (check for `NEXT_PUBLIC_CDP_API_KEY` values)
- [ ] Foundry keystores (`~/.foundry/keystores/`)
- [ ] Contract deployment artifacts (`contracts/out/`, `contracts/broadcast/`)

## Build Artifacts

- [ ] `node_modules/` (should be ignored)
- [ ] `.next/` folder (Next.js build)
- [ ] `out/` folder
- [ ] `dist/` folder
- [ ] `contracts/cache/`
- [ ] `contracts/out/`

## IDE & OS Files

- [ ] `.vscode/` (if contains personal settings)
- [ ] `.idea/` (IntelliJ settings)
- [ ] `.DS_Store` (Mac files)
- [ ] `Thumbs.db` (Windows files)

## Documentation

- [ ] `docs/` folder (if it's a copy of Base documentation, should be ignored)
- [ ] `vibecode/` folder (if it's project-specific, keep it; if it's template, consider ignoring)

## What SHOULD Be Committed

- [ ] Source code (`.tsx`, `.ts`, `.sol` files)
- [ ] Configuration files (`package.json`, `tsconfig.json`, `next.config.ts`)
- [ ] README and documentation (`README.md`, `SETUP.md`, `LOGIC_AND_WORKFLOW.md`)
- [ ] `.env.example` (template file, no real values)
- [ ] `.gitignore` (this file)
- [ ] `minikit.config.ts` (without real `accountAssociation` values if not signed yet)

## Quick Check Commands

Before committing, run these commands to check for sensitive data:

```bash
# Check for .env files
find . -name ".env*" -not -name ".env.example" | grep -v node_modules

# Check for private keys in code
grep -r "PRIVATE_KEY\|privateKey\|0x[a-fA-F0-9]\{64\}" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.sol" | grep -v node_modules | grep -v ".next"

# Check for API keys
grep -r "cdp.*api.*key\|CDP_API_KEY" --include="*.ts" --include="*.tsx" --include="*.js" -i | grep -v node_modules | grep -v ".next"

# List files to be committed
git status
```

## If You Accidentally Commit Sensitive Data

1. **DO NOT** add more commits
2. Remove the file from Git history:
   ```bash
   git rm --cached <file>
   git commit --amend
   ```
3. If already pushed, you may need to:
   - Rotate/regenerate all exposed secrets
   - Consider using `git filter-branch` or `git filter-repo` (advanced)
   - Contact repository administrator

## Safe to Commit

These files are safe and should be committed:

- `package.json` (dependencies list)
- `tsconfig.json` (TypeScript config)
- `next.config.ts` (Next.js config)
- `tailwind.config.ts` (Tailwind config)
- `foundry.toml` (Foundry config - no secrets)
- `contracts/src/*.sol` (source code)
- `contracts/script/*.sol` (deployment scripts)
- `app/**/*.tsx` (React components)
- `components/**/*.tsx` (components)
- `lib/**/*.ts` (utilities)
- `README.md`, `SETUP.md`, `LOGIC_AND_WORKFLOW.md` (documentation)
- `.env.example` (template only)

## Notes

- The `.gitignore` file has been configured to automatically ignore most sensitive files
- Always review `git status` before committing
- When in doubt, don't commit - ask first
- Use `.env.example` as a template for environment variables

