# NEXXTFOLIO - Quick Start Guide

## 🚀 Quick Start (5 minutes)

### 1. Start Development Server
```bash
cd client
npm run dev
```
Visit: `http://localhost:5174/`

### 2. Explore the App
- Click "Resume Builder" to create a resume
- Click "Portfolio" to view the portfolio showcase
- Click "AI Assistant" to chat with the AI

### 3. Build for Production
```bash
npm run build
```

---

## 📝 Common Tasks

### Add a New Component
```bash
# Create a new file in src/components/
touch src/components/MyComponent.jsx
```

```jsx
// src/components/MyComponent.jsx
export default function MyComponent() {
  return (
    <div className="p-6 bg-white rounded-2xl shadow-soft-md">
      {/* Your component */}
    </div>
  );
}
```

### Update Resume Data
```javascript
import { useResumeStore } from '../store';

function MyComponent() {
  const { resumeData, updatePersonal, addSkill } = useResumeStore();

  // Update personal info
  updatePersonal({
    fullName: 'John Doe',
    email: 'john@example.com'
  });

  // Add a skill
  addSkill('React');
}
```

### Create a Form
```jsx
import { useForm } from 'react-hook-form';
import { Input, Button } from '../components';

export default function MyForm() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Email"
        {...register('email', { required: 'Email is required' })}
        error={errors.email?.message}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
}
```

### Add a Gradient Background
```jsx
<div className="bg-gradient-brand text-white p-6 rounded-2xl">
  Content with brand gradient
</div>
```

### Create a Glass Effect Component
```jsx
<div className="glass p-6 rounded-2xl">
  Glass effect content
</div>
```

---

## 🎨 Common Styling

### Full Width Container
```jsx
<div className="w-full max-w-6xl mx-auto px-6">
  Content
</div>
```

### Centered Flex Container
```jsx
<div className="flex flex-col items-center justify-center">
  Content
</div>
```

### Grid Layout (Responsive)
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div>Column 1</div>
  <div>Column 2</div>
  <div>Column 3</div>
</div>
```

### Section Spacing
```jsx
<div className="space-y-8">
  <section>Section 1</section>
  <section>Section 2</section>
  <section>Section 3</section>
</div>
```

---

## 🧠 State Management Quick Reference

### Using Resume Store
```javascript
import { useResumeStore } from '../store';

const store = useResumeStore();
store.resumeData              // Get resume data
store.updatePersonal(data)    // Update personal info
store.addExperience(exp)      // Add work experience
store.addEducation(edu)       // Add education
store.addSkill(skill)         // Add skill
store.addProject(project)     // Add project
```

### Using AI Store
```javascript
import { useAIStore } from '../store';

const store = useAIStore();
store.messages                // Get all messages
store.isLoading              // Check loading state
store.addMessage(msg)        // Add a message
store.clearMessages()        // Clear message history
store.setLoading(true)       // Set loading state
```

### Using UI Store
```javascript
import { useUIStore } from '../store';

const store = useUIStore();
store.activeTab              // Current active tab
store.previewMode            // Preview mode (resume/portfolio)
store.sidebarOpen            // Sidebar visibility
store.setActiveTab(tab)      // Switch tab
store.setPreviewMode(mode)   // Switch preview
store.setSidebarOpen(bool)   // Toggle sidebar
```

---

## 🎨 Design Tokens Quick Reference

### Colors
```
Primary:     text-indigo-600 or bg-indigo-600
Secondary:   text-purple-600 or bg-purple-600
Background:  bg-slate-50
Dark:        text-slate-900 or bg-slate-900
Success:     text-green-600 or bg-green-600
Error:       text-red-600 or bg-red-600
Warning:     text-yellow-600 or bg-yellow-600
```

### Shadows
```
shadow-soft-sm  - Small elements
shadow-soft-md  - Cards at rest
shadow-soft-lg  - Cards on hover
shadow-glass    - Glass effect components
```

### Border Radius
```
rounded-lg   - Buttons, inputs (8px)
rounded-xl   - Cards (12px)
rounded-2xl  - Feature cards (16px)
rounded-full - Badges, circles
```

### Spacing
```
p-4 or p-6   - Component padding
m-4 or m-6   - Component margin
gap-4        - Grid gaps
mb-8 or mb-12 - Section spacing
```

---

## 🔧 Debugging Tips

### Check State in Console
```javascript
import { useResumeStore } from '../store';

function Debug() {
  const store = useResumeStore();
  console.log('Resume Store:', store);
}
```

### Inspect Component Props
```javascript
function MyComponent(props) {
  console.log('Component Props:', props);
  return <div>{JSON.stringify(props, null, 2)}</div>;
}
```

### Check Tailwind Classes
```bash
# Make sure class names are in the content path
# Check tailwind.config.js for:
content: [
  "./index.html",
  "./src/**/*.{js,jsx,ts,tsx}",
]
```

---

## 📦 File Structure Reference

```
client/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Input.jsx
│   │   ├── Textarea.jsx
│   │   ├── Badge.jsx
│   │   ├── UploadBox.jsx
│   │   └── index.js
│   ├── features/           # Feature modules
│   │   ├── ResumeBuilder.jsx
│   │   ├── ResumePreview.jsx
│   │   ├── PortfolioPreview.jsx
│   │   ├── AIAssistant.jsx
│   │   └── index.js
│   ├── layouts/            # Layout components
│   │   └── MainLayout.jsx
│   ├── store/              # State management
│   │   └── index.js
│   ├── App.jsx             # Root component
│   ├── main.jsx            # Entry point
│   ├── index.css           # Global styles
│   ├── COMPONENT_GUIDE.md  # Component examples
│   └── STYLING_GUIDE.md    # Styling guidelines
├── public/                 # Static assets
├── dist/                   # Build output
├── index.html              # HTML template
├── tailwind.config.js      # Tailwind configuration
├── vite.config.js          # Vite configuration
├── package.json            # Dependencies
└── README_NEXTFOLIO.md     # Project README
```

---

## 🚨 Common Issues & Solutions

### Issue: Port 5173/5174 already in use
```bash
# Kill process on port 5173
npx kill-port 5173
# Or use a different port
npm run dev -- --port 3000
```

### Issue: Tailwind styles not showing
```bash
# Clear cache and rebuild
rm -rf node_modules
npm install
npm run dev
```

### Issue: Component not updating
```javascript
// Make sure you're using the store correctly
const { resumeData, updatePersonal } = useResumeStore();
// Not: const store = useResumeStore() and then store.resumeData
```

### Issue: Form not submitting
```javascript
// Make sure form has onSubmit handler
<form onSubmit={handleSubmit(onSubmit)}>
  {/* form fields */}
</form>
```

---

## 📚 Useful Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Check Tailwind classes
grep -r "class=" src/ | grep "undefined"
```

---

## 🔗 Important Links

- **Dev Server**: `http://localhost:5174/`
- **Tailwind Docs**: `https://tailwindcss.com/`
- **React Docs**: `https://react.dev/`
- **Zustand Docs**: `https://zustand-demo.vercel.app/`
- **React Hook Form**: `https://react-hook-form.com/`
- **Lucide Icons**: `https://lucide.dev/`

---

## 💡 Pro Tips

1. **Use `animate-fade-in` for new content** - Makes transitions smooth
2. **Always use `glass` class** for secondary panels - Looks premium
3. **Use `gradient-text` for headings** - Matches brand identity
4. **Test on mobile** - Use `md:`, `lg:` prefixes for responsive design
5. **Check accessibility** - Use semantic HTML and ARIA labels
6. **Keep components small** - Easier to test and reuse
7. **Use Zustand for global state** - Simpler than Context API
8. **Use React Hook Form** - Better performance than controlled components

---

## 🎯 Developer Workflow

1. **Create feature branch**
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Run dev server**
   ```bash
   npm run dev
   ```

3. **Build components**
   - Check `COMPONENT_GUIDE.md` for examples
   - Use existing components as templates

4. **Style with Tailwind**
   - Check `STYLING_GUIDE.md` for patterns
   - Use design tokens from `tailwind.config.js`

5. **Test responsiveness**
   - Test on mobile, tablet, desktop
   - Use browser DevTools

6. **Build and test**
   ```bash
   npm run build
   npm run preview
   ```

7. **Commit changes**
   ```bash
   git add .
   git commit -m "feat: add my feature"
   ```

---

## 📞 Need Help?

- Check **COMPONENT_GUIDE.md** for component usage
- Check **STYLING_GUIDE.md** for styling patterns
- Check **README_NEXTFOLIO.md** for project overview
- Check **COMPLETION_SUMMARY.md** for architecture overview

---

**Happy coding! 🚀**
