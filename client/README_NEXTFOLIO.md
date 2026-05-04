# Nextfolio - Premium SaaS Resume & Portfolio Builder

A production-ready, modern SaaS frontend for building professional resumes and portfolios with an AI-powered assistant. Built with React, Tailwind CSS, and a beautiful gradient-based design system.

## 🎨 Design System

**Color Palette:**
- **Gradient**: Indigo → Blue → Purple (#4F46E5 → #7C3AED)
- **Primary**: #4F46E5 (Indigo)
- **Secondary**: #7C3AED (Purple)
- **Background**: #F8FAFC (Slate)
- **Dark**: #0F172A (Navy)

**Visual Features:**
- ✨ Glassmorphism effects with backdrop blur
- 🎯 Rounded-2xl components with soft shadows
- 🌈 Gradient highlights on primary actions
- ✅ Clean whitespace and minimal layout
- 🎬 Smooth animations and micro-interactions

## 🚀 Features

### 1. **Resume Builder**
- Dynamic form inputs with real-time validation
- Sections: Personal Info, Experience, Education, Skills, Projects
- React Hook Form for efficient form management
- Auto-save with Zustand state management
- Clean, intuitive UI with step-by-step guidance

### 2. **Resume Preview**
- Professional ATS-friendly layout
- Real-time updates as you edit
- Print-ready design
- Minimal, elegant presentation

### 3. **Portfolio Showcase**
- Full website-style preview
- Gradient hero section with animated blobs
- Experience cards with glassmorphism
- Skills grid with hover effects
- Project showcase with CTAs
- Responsive design for all devices

### 4. **AI Assistant Panel**
- Chat interface with message bubbles
- Gradient send button
- Real-time typing indicators
- Message history management
- Demo integration ready for API connection

### 5. **Upload Box**
- Drag & drop file upload
- Animated hover states
- File validation
- Visual feedback

## ⚛️ Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool & dev server
- **Tailwind CSS 4** - Utility-first styling
- **Zustand** - State management
- **React Hook Form** - Form handling
- **Lucide React** - Beautiful icon library

## 📁 Project Structure

```
/src
├── /components           # Reusable UI components
│   ├── Button.jsx
│   ├── Card.jsx
│   ├── Input.jsx
│   ├── Textarea.jsx
│   ├── Badge.jsx
│   ├── UploadBox.jsx
│   └── index.js         # Component exports
├── /features            # Feature modules
│   ├── ResumeBuilder.jsx
│   ├── ResumePreview.jsx
│   ├── PortfolioPreview.jsx
│   ├── AIAssistant.jsx
│   └── index.js
├── /layouts            # Layout components
│   └── MainLayout.jsx
├── /store              # Zustand stores
│   └── index.js
├── App.jsx             # Root component
├── index.css           # Global styles
└── main.jsx            # App entry point
```

## 🎯 Component Details

### Buttons
- **Variants**: primary, secondary, outline, ghost, danger, glass
- **Sizes**: sm, md, lg, xl
- **Features**: Hover scale, gradient backgrounds, smooth transitions

### Cards
- **Glass effect** with backdrop blur
- **Interactive mode** with scale animation
- **Custom shadows** for depth

### Inputs
- **Auto-complete support**
- **Icon support** with left-aligned icons
- **Error states** with validation feedback
- **Helper text** for guidance

### Badge
- **Multiple variants** for different contexts
- **Closable option** for tags/skills
- **Size variants** for flexibility

## 🎬 Animations

All components feature smooth micro-interactions:
- Fade-in animations on load
- Slide-up transitions for content
- Soft pulse effects for loading states
- Scale transforms on hover
- Smooth transitions between states

## 💾 State Management

### Zustand Stores

#### `useResumeStore`
Manages all resume data:
- Personal information
- Work experience (add, update, remove)
- Education (add, update, remove)
- Skills (add, remove)
- Projects (add, update, remove)

#### `useAIStore`
Manages AI assistant state:
- Messages array
- Loading states
- Message actions

#### `useUIStore`
Manages UI state:
- Active tab
- Preview mode
- Sidebar visibility

## 🚀 Getting Started

### Installation

```bash
cd client
npm install
```

### Development

```bash
npm run dev
```

Visit `http://localhost:5174/` in your browser.

### Build

```bash
npm run build
```

### Preview Build

```bash
npm run preview
```

## 📱 Responsive Design

The application is fully responsive:
- **Mobile**: Single column layout with collapsible sidebar
- **Tablet**: Two-column layout
- **Desktop**: Three-panel layout (sidebar, editor, preview)

Mobile-first design ensures optimal experience on all devices.

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to customize the color scheme:

```javascript
backgroundColor: {
  "brand-bg": "#f8fafc",
  "brand-dark": "#0f172a",
}
```

### Typography
Tailwind's default typography scale is used. Customize in `tailwind.config.js`.

### Spacing
Standard Tailwind spacing scale. Adjust in `tailwind.config.js`.

## 🔧 Component API

### Button Component
```jsx
<Button 
  variant="primary"      // primary | secondary | outline | ghost | danger | glass
  size="md"             // sm | md | lg | xl
  disabled={false}
>
  Click me
</Button>
```

### Input Component
```jsx
<Input 
  label="Full Name"
  placeholder="John Doe"
  icon={User}           // Lucide icon
  error="Error message"
  helperText="Helper text"
/>
```

### Card Component
```jsx
<Card 
  glassy={false}
  interactive={false}
>
  Card content
</Card>
```

## 📊 Form Management

Uses React Hook Form for efficient form handling:

```jsx
const { register, handleSubmit, watch } = useForm({
  defaultValues: { /* ... */ }
});
```

## 🔌 API Integration Ready

The application is structured for easy API integration:

1. **Resume API**: Replace mock data with API calls
2. **AI Assistant API**: Connect to your LLM service
3. **File Upload**: Integrate with cloud storage
4. **Authentication**: Add user auth with context/providers

## 🎨 Design Tokens

Global CSS variables in `index.css`:
- Gradient definitions
- Color utilities
- Shadow definitions
- Animation keyframes

## ⚡ Performance Optimizations

- ✅ Code splitting with Vite
- ✅ Lazy component loading
- ✅ Optimized Tailwind bundle
- ✅ Minimal re-renders with Zustand
- ✅ Efficient form updates with React Hook Form

## 🐛 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 License

MIT

## 🤝 Contributing

This is a starter template. Feel free to customize and extend!

## 🎯 Next Steps

1. **Connect APIs**: Replace mock data with real API endpoints
2. **Add Authentication**: Implement user login/signup
3. **Database**: Setup Firestore/MongoDB for data persistence
4. **File Storage**: Integrate S3/Firebase for resume uploads
5. **Email**: Add email notifications for new messages
6. **Analytics**: Track user interactions

## 📧 Support

For issues or questions, refer to the component documentation in the code.

---

Built with ❤️ using React, Tailwind CSS, and modern web technologies.
