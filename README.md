# What is Aeter

Aeter is developer toolset for rapid web3 development and testing. It includes:
- Desktop Wallet
- Companion browser extension
- Local Block Explorer for all blockchain data including smart contracts

# How to run

**Desktop app**
```
cd desktop
bun install
bun run tauri dev
```

**Browser extension**
```
cd extension
bun install
bun run dev
```
Then:
1. Go to chrome://extensions
2. Click "Developer mode" in the right corner
3. Click "Load unpacked" in the left corner
4. Choose `dist`` folder in extention folder


# Contribute

## Git

We follow Git-flow like approach:
- Main branch is base
- For new features you have to create feature/{FEATURE_NAME} branch
- For bugfixes you have to create bugfix/{FIX_NAME} branch
- Open PR to main
- After getting 1 approve PR can be merged

Rules:
- Commit names should follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/). For example `feat: allow provided config object to extend other configs`
- Rebase into `main`` your branch when possible
- Never force push to main

## Code convetions

- Make sure you have Prettier up with [format on save](https://www.robinwieruch.de/how-to-use-prettier-vscode/)