# 🐦 Flappy Bird 3D - Blockchain Gaming Experience

A modern 3D implementation of the classic Flappy Bird game featuring stunning three-dimensional graphics, blockchain integration, and cross-platform compatibility. Built with cutting-edge web technologies and deployed as both a web application and native Android app.

![Flappy Bird 3D](https://img.shields.io/badge/Game-Flappy%20Bird%203D-yellow)
![Next.js](https://img.shields.io/badge/Next.js-15.3.2-black)
![React](https://img.shields.io/badge/React-19.0.0-blue)
![Three.js](https://img.shields.io/badge/Three.js-0.176.0-green)
![Capacitor](https://img.shields.io/badge/Capacitor-Native%20Android-blue)

## ✨ Features

- **🎮 3D Graphics**: Immersive three-dimensional gameplay using React Three Fiber
- **📱 Cross-Platform**: Play in browser or on Android devices
- **🔗 Blockchain Integration**: Solana wallet integration with on-chain scoring
- **🎯 Power-ups System**: Speed boost, slow motion, and inverted controls
- **🏆 Global Leaderboard**: Firebase-powered ranking system
- **🎨 Dynamic Visuals**: Animated bird with color-changing effects
- **📺 Fullscreen Mode**: Immersive gaming experience across all devices
- **⚡ Real-time Physics**: Smooth 60fps gameplay with realistic bird physics

## 🛠 Technology Stack

### Frontend
- **Next.js 15.3.2** - React framework with static export
- **React 19** - Modern UI library
- **React Three Fiber** - React bindings for Three.js
- **Three.js** - 3D graphics library
- **TypeScript** - Type-safe JavaScript

### Mobile
- **Capacitor** - Native mobile app framework
- **Android SDK** - Native Android development

### Blockchain
- **Solana Web3.js** - Blockchain wallet integration
- **Devnet** - Development blockchain network

### Backend Services
- **Firebase Firestore** - Real-time leaderboard database
- **React Toastify** - User notifications

## 📋 Prerequisites

Before you begin, ensure you have installed:

- **Node.js** (version 18.0 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

### For Android Development (Optional)
- **Android Studio** (latest version)
- **Android SDK** (API level 21 or higher)
- **Java JDK** (version 17 or higher)

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd flappy-bird
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Setup (Optional)
Create a `.env.local` file for custom configurations:
```bash
# Firebase configuration (if using custom Firebase project)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
```

## 🎮 Development

### Run Web Version
Start the development server:
```bash
npm run dev
```
Open [http://localhost:3001](http://localhost:3001) in your browser.

### Build for Production
```bash
npm run build
```

### Code Formatting
```bash
npm run format          # Format code
npm run format:check    # Check formatting
npm run lint           # Run ESLint
```

## 📱 Android App Development

### 1. Initial Setup
The project is already configured with Capacitor. To set up Android development:

```bash
# Install Android platform (already done)
npm install @capacitor/android

# Add Android platform (already done)
npx cap add android
```

### 2. Build and Sync
```bash
# Build the web assets
npm run build

# Sync with Android project
npx cap sync android
```

### 3. Open in Android Studio
```bash
npx cap open android
```

### 4. Run on Device/Emulator
```bash
# Run directly (requires Android SDK in PATH)
npx cap run android

# Or use Android Studio:
# - Open the project in Android Studio
# - Connect device or start emulator
# - Click "Run" button
```

## 🎯 Game Controls

- **Click/Tap**: Make the bird jump
- **Spacebar**: Alternative jump control (web version)
- **Collect Power-ups**: 
  - 🚀 **Speed Boost**: Faster obstacle movement
  - 🐌 **Slow Motion**: Slower obstacle movement  
  - 🔄 **Inverted Controls**: Reverse jump direction

## 🏗 Project Architecture

### Directory Structure
```
flappy-bird/
├── android/                 # Native Android project
├── public/                  # Static assets
│   ├── speed.png           # Speed boost icon
│   ├── slow.png            # Slow motion icon
│   └── invert.png          # Invert controls icon
├── src/
│   ├── app/                # Next.js app directory
│   │   ├── page.tsx        # Main game page
│   │   ├── layout.tsx      # Root layout
│   │   └── globals.css     # Global styles
│   ├── components/         # React components
│   │   ├── Bird.tsx        # 3D bird model
│   │   ├── GameLogic/      # Core game mechanics
│   │   ├── Screen/         # Game screens
│   │   ├── Leaderboard.tsx # Scoring system
│   │   └── ...
│   ├── lib/
│   │   └── firebase.ts     # Firebase configuration
│   ├── utils/
│   │   └── wallet.ts       # Solana wallet utilities
│   ├── constants.ts        # Game constants
│   └── types.ts           # TypeScript definitions
├── capacitor.config.ts     # Capacitor configuration
├── next.config.ts         # Next.js configuration
└── package.json           # Dependencies and scripts
```

### Key Components
- **`GameLogic.tsx`**: Core game mechanics, physics, and collision detection
- **`Bird.tsx`**: 3D bird model with animations and visual effects
- **`StartScreen.tsx`**: Wallet integration and game initialization
- **`Leaderboard.tsx`**: Firebase-powered scoring system
- **`Background.tsx`**: 3D city environment rendering

## 🔧 Configuration

### Game Settings
Edit `src/constants.ts` to modify:
- Perk effect multipliers
- Spawn rates
- Game physics parameters

### Capacitor Configuration
The `capacitor.config.ts` includes:
- Fullscreen mode settings
- Status bar configuration
- Android-specific optimizations

## 🚨 Troubleshooting

### Common Issues

**Build Errors:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Android Build Issues:**
```bash
# Clean and rebuild
npx cap sync android
cd android && ./gradlew clean
npx cap open android
```

**3D Rendering Issues:**
- Ensure WebGL is enabled in your browser
- Update graphics drivers
- Try a different browser

### Performance Optimization
- Use production build for better performance
- Enable hardware acceleration in browser
- Close other applications when running on mobile

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Original Flappy Bird game concept by Dong Nguyen
- Three.js community for 3D graphics inspiration
- React Three Fiber team for excellent React integration
- Capacitor team for seamless mobile development

---

**🎮 Ready to play? Start your blockchain gaming journey today!**