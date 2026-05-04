# NextFolio

A comprehensive portfolio and resume builder application that helps professionals create stunning portfolios, optimize resumes, and showcase their work across multiple platforms.

## 🌟 Features

- **Portfolio Builder**: Create professional portfolios with multiple themes
- **Resume Builder**: Build and optimize resumes with AI assistance
- **CLI Portfolio**: Generate command-line interface portfolios for terminal enthusiasts
- **AI Assistant**: Get AI-powered suggestions for resume content, keywords, and optimization
- **Design Panel**: Customize the look and feel of your portfolio
- **ATS Optimization**: Score and optimize resumes for Applicant Tracking Systems
- **Theme Support**: Multiple pre-built themes for customization
- **Authentication**: Secure login and user management
- **Preview Mode**: Real-time preview of portfolios and resumes

## 🛠️ Tech Stack

### Frontend
- **Framework**: React with Vite
- **Styling**: Tailwind CSS
- **State Management**: Redux
- **UI Components**: Custom component library
- **Routing**: React Router

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Authentication**: JWT-based auth
- **File Processing**: PDF parsing and generation

### AI/ML Services
- **AI Parser**: Python-based resume parsing
- **ATS Scorer**: Resume ATS compatibility scoring
- **Bio Optimizer**: Professional bio optimization
- **Keyword Optimizer**: Resume keyword optimization

## 📁 Project Structure

```
NextFolio/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── features/      # Feature modules (Resume, Portfolio, etc.)
│   │   ├── pages/         # Page components
│   │   ├── store/         # State management
│   │   └── utils/         # Utility functions
│   ├── public/            # Static assets
│   │   └── cli/           # CLI portfolio template
│   └── package.json
├── server/                # Backend Express server
│   ├── routes/            # API routes
│   ├── models/            # Data models
│   ├── services/          # Business logic & AI services
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Python 3.8+ (for AI services)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd NextFolio
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up environment variables**
   - Create `.env` files in both `client/` and `server/` directories
   - Configure API endpoints, database connections, and AI service keys

### Running the Application

**Development Mode:**

Terminal 1 - Start the server:
```bash
cd server
npm start
```

Terminal 2 - Start the client:
```bash
cd client
npm run dev
```

The application will be available at `http://localhost:5173` (Vite default)

**Production Build:**
```bash
cd client
npm run build
```

## 📖 Documentation

- [Architecture Guide](./ARCHITECTURE.md) - System design and architecture
- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - Deployment instructions
- [Component Guide](./client/src/COMPONENT_GUIDE.md) - UI component documentation
- [Styling Guide](./client/src/STYLING_GUIDE.md) - CSS and Tailwind guidelines
- [Quick Start](./client/QUICK_START.md) - Quick start guide

## 🎨 Features in Detail

### Resume Builder
Build professional resumes with:
- Multiple templates
- AI-powered content suggestions
- Real-time preview
- ATS optimization scoring
- PDF export

### Portfolio Generator
Create stunning portfolios with:
- Customizable themes
- Project showcase
- Social links integration
- Responsive design
- Live preview

### CLI Portfolio
Generate terminal-based portfolios:
- Text-based portfolio for terminal users
- ASCII art support
- Custom styling
- Easy navigation

### AI Assistant
Get intelligent recommendations for:
- Resume content optimization
- Keyword suggestions for better ATS scores
- Professional bio writing
- Resume gap analysis

## 🔒 Authentication

NextFolio uses JWT-based authentication for secure access. Users can:
- Register new accounts
- Login securely
- Manage their profiles
- Save multiple portfolios and resumes

## 🧪 Testing

Run tests with:
```bash
cd server
npm test

cd ../client
npm test
```

## 📊 API Routes

### Core Routes
- `/api/auth` - Authentication endpoints
- `/api/resume` - Resume builder API
- `/api/portfolio` - Portfolio API
- `/api/upload` - File upload handling
- `/api/generate` - Portfolio/resume generation
- `/api/ai` - AI service endpoints

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

## 🆘 Support

For support, please:
- Check the documentation files
- Open an issue on GitHub
- Contact the development team

## 🎯 Roadmap

- [ ] Advanced theme customization
- [ ] Real-time collaboration
- [ ] More AI optimization features
- [ ] Mobile app version
- [ ] Video portfolio support
- [ ] Analytics dashboard

---

**Made with ❤️ by the NextFolio Team**
