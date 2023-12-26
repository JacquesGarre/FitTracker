# Requirements

- node v20+ (node -v)
- npm

# Setup

- npm i -g @ionic/cli
- npm install
- ionic serve

# Build

- npx capacitor-assets generate
- In android\app\build.gradle, increment versionCode and versionName
- In package.json, increment version
- npm run build
- npx cap copy 
- npx cap sync
