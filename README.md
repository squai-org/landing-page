# Squai Landing Page

Welcome to the Squai landing page repository! This is a modern, responsive landing page showcasing Squai's AI implementation services.

🌐 **[Visit the Live Website](https://heysquai.vercel.app/)** - See the production deployment

## 📋 About Squai

Squai helps teams implement AI strategically by:
- **Squaimap**: Discovering where AI can make a real impact on your business operations
- **Squailab**: Building and implementing AI systems that your team will actually use
- **And more**: Custom solutions tailored to your industry and needs

This landing page introduces Squai's services across multiple industries and provides information on how to get started.

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with PostCSS
- **UI Components**: Shadcn/ui powered by Radix UI
- **Testing**: Vitest
- **Linting**: ESLint

## 🚀 Getting Started

### Local Development

#### Prerequisites
- Node.js 16+ and npm installed ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- Git

#### Setup Steps

1. **Clone the repository**
   ```sh
   git clone https://github.com/squai-org/landing-page.git
   cd landing-page
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Start the development server**
   ```sh
   npm run dev
   ```
   
   The application will be available at `http://localhost:5173` with hot module reloading enabled for instant preview of changes.

### GitHub Codespaces

For a browser-based development environment:

1. **Navigate to the repository** on GitHub
2. **Click the "Code" button** (green button) near the top right
3. **Select the "Codespaces" tab**
4. **Click "New codespace"** to launch a new environment

Once the codespace loads:
```sh
npm install
npm run dev
```

The dev server will start automatically, and you can access it via the port forwarding notification.

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run build:dev` | Build in development mode |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint to check code quality |
| `npm run test` | Run tests once |
| `npm run test:watch` | Run tests in watch mode |

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Shadcn/ui components
│   ├── HeroSection.tsx
│   ├── ServicesSection.tsx
│   ├── IndustriesSection.tsx
│   └── ...             # Other page sections
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utilities and constants
│   └── content.ts      # Multi-language content
├── styles/             # Global styles
└── App.tsx             # Main app component
```

## 🌍 Multi-language Support

The landing page supports both English (en) and Spanish (es). Content is managed in `src/lib/content.ts`.

## 🧪 Testing

Run tests with Vitest:
```sh
npm run test        # Single run
npm run test:watch  # Watch mode
```

## 📝 Building for Production

Create an optimized production build:
```sh
npm run build
```

Output files are generated in the `dist/` directory, ready for deployment.

Preview the production build locally:
```sh
npm run preview
```

## 🔧 Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Test locally (`npm run dev` and `npm run test`)
4. Commit and push your changes
5. Create a pull request

## 📄 License

See LICENSE file for details.

## 📞 Questions?

For issues or questions about this repository, please open a GitHub issue.
