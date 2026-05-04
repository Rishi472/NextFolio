/**
 * Component Usage Guide & Examples
 * 
 * This file documents all available components and their usage patterns.
 * Copy and paste examples to use in your application.
 */

// ============================================================================
// BUTTON COMPONENT
// ============================================================================

/**
 * Primary Button - Used for main CTAs
 */
export const ButtonPrimaryExample = () => (
  <Button variant="primary" size="md">
    Get Started
  </Button>
);

/**
 * Secondary Button - For alternative actions
 */
export const ButtonSecondaryExample = () => (
  <Button variant="secondary" size="md">
    Learn More
  </Button>
);

/**
 * Ghost Button - Minimal style
 */
export const ButtonGhostExample = () => (
  <Button variant="ghost">
    Cancel
  </Button>
);

/**
 * All Button Sizes
 */
export const ButtonSizesExample = () => (
  <div className="flex gap-4">
    <Button size="sm">Small</Button>
    <Button size="md">Medium</Button>
    <Button size="lg">Large</Button>
    <Button size="xl">Extra Large</Button>
  </div>
);

// ============================================================================
// CARD COMPONENT
// ============================================================================

/**
 * Basic Card
 */
export const CardBasicExample = () => (
  <Card>
    <div className="p-6">
      <h3 className="font-bold mb-2">Card Title</h3>
      <p className="text-gray-600">Card content goes here</p>
    </div>
  </Card>
);

/**
 * Glass Card - Glassmorphism effect
 */
export const CardGlassExample = () => (
  <Card glassy>
    <div className="p-6">
      <h3 className="font-bold mb-2">Glass Card</h3>
      <p className="text-gray-600">Beautiful glass effect with backdrop blur</p>
    </div>
  </Card>
);

/**
 * Interactive Card
 */
export const CardInteractiveExample = () => (
  <Card interactive onClick={() => alert('Card clicked!')}>
    <div className="p-6">
      <h3 className="font-bold mb-2">Click me!</h3>
      <p className="text-gray-600">This card has hover effects</p>
    </div>
  </Card>
);

// ============================================================================
// INPUT COMPONENT
// ============================================================================

/**
 * Basic Input
 */
export const InputBasicExample = () => (
  <Input 
    label="Email Address"
    type="email"
    placeholder="your@email.com"
  />
);

/**
 * Input with Icon
 */
export const InputWithIconExample = () => (
  <Input 
    label="Username"
    placeholder="Enter username"
    icon={User}
  />
);

/**
 * Input with Error
 */
export const InputErrorExample = () => (
  <Input 
    label="Password"
    type="password"
    placeholder="Enter password"
    error="Password must be at least 8 characters"
  />
);

/**
 * Input with Helper Text
 */
export const InputHelperExample = () => (
  <Input 
    label="Full Name"
    placeholder="John Doe"
    helperText="Enter your full legal name"
  />
);

// ============================================================================
// TEXTAREA COMPONENT
// ============================================================================

/**
 * Basic Textarea
 */
export const TextareaBasicExample = () => (
  <Textarea 
    label="Description"
    placeholder="Enter your description"
    rows={4}
  />
);

/**
 * Textarea with Character Count
 */
export const TextareaCounterExample = () => (
  <Textarea 
    label="Bio"
    placeholder="Tell us about yourself"
    maxLength={500}
    showCount
  />
);

// ============================================================================
// BADGE COMPONENT
// ============================================================================

/**
 * Basic Badges
 */
export const BadgeBasicExample = () => (
  <div className="flex gap-2">
    <Badge variant="primary">React</Badge>
    <Badge variant="secondary">Tailwind</Badge>
    <Badge variant="success">Active</Badge>
    <Badge variant="warning">Pending</Badge>
    <Badge variant="danger">Error</Badge>
  </div>
);

/**
 * Closable Badge (for tags)
 */
export const BadgeClosableExample = () => (
  <Badge 
    variant="primary" 
    closable 
    onClose={() => alert('Badge removed')}
  >
    Skill: React
  </Badge>
);

// ============================================================================
// UPLOAD BOX COMPONENT
// ============================================================================

/**
 * Resume Upload Box
 */
export const UploadBoxExample = () => (
  <UploadBox 
    label="Upload Resume"
    description="Drag and drop or click to select"
    accept=".pdf,.doc,.docx"
    onFileSelect={(file) => console.log('File selected:', file)}
  />
);

// ============================================================================
// FORM EXAMPLE - Resume Builder Pattern
// ============================================================================

export const ResumeFormExample = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log('Form submitted:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Personal Section */}
      <Card glassy className="p-6">
        <h3 className="text-xl font-bold gradient-text mb-4">Personal Information</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <Input 
            label="Full Name"
            {...register('fullName', { required: 'Name is required' })}
            error={errors.fullName?.message}
          />
          <Input 
            label="Email"
            type="email"
            {...register('email', { required: 'Email is required' })}
            error={errors.email?.message}
          />
        </div>

        <Textarea 
          label="Professional Summary"
          {...register('summary')}
          maxLength={500}
          showCount
          className="mt-4"
        />
      </Card>

      {/* Skills Section */}
      <Card glassy className="p-6">
        <h3 className="text-xl font-bold gradient-text mb-4">Skills</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="primary" closable>React</Badge>
          <Badge variant="primary" closable>JavaScript</Badge>
          <Badge variant="primary" closable>Tailwind</Badge>
        </div>
        <Input placeholder="Add a skill and press Enter" />
      </Card>

      {/* Submit */}
      <div className="flex gap-3">
        <Button variant="primary" type="submit" className="flex-1">
          Save Resume
        </Button>
        <Button variant="secondary" type="reset" className="flex-1">
          Clear
        </Button>
      </div>
    </form>
  );
};

// ============================================================================
// LAYOUT EXAMPLE - Three Panel Layout
// ============================================================================

export const ThreePanelLayoutExample = () => (
  <div className="h-screen flex gap-6 p-6 bg-slate-50">
    {/* Left: Editor */}
    <div className="flex-1 bg-white rounded-2xl p-6 shadow-soft-md overflow-y-auto">
      <h2 className="text-2xl font-bold gradient-text mb-6">Editor Panel</h2>
      {/* Form content here */}
    </div>

    {/* Right: Preview */}
    <div className="w-96 bg-white rounded-2xl p-6 shadow-soft-md overflow-y-auto">
      <h2 className="text-xl font-bold gradient-text mb-6">Live Preview</h2>
      {/* Preview content here */}
    </div>
  </div>
);

// ============================================================================
// STATE MANAGEMENT EXAMPLE - Using Zustand Stores
// ============================================================================

export const StateManagementExample = () => {
  const { resumeData, updatePersonal, addSkill, removeSkill } = useResumeStore();
  const { messages, addMessage, clearMessages } = useAIStore();
  const { activeTab, setActiveTab } = useUIStore();

  return (
    <div className="space-y-4">
      {/* Update personal info */}
      <Button onClick={() => updatePersonal({
        fullName: 'John Doe',
        email: 'john@example.com'
      })}>
        Update Resume
      </Button>

      {/* Add skill */}
      <Button onClick={() => addSkill('React')}>
        Add Skill
      </Button>

      {/* Add message */}
      <Button onClick={() => addMessage({
        role: 'user',
        content: 'Hello AI!',
        timestamp: new Date()
      })}>
        Send Message
      </Button>

      {/* Switch tab */}
      <Button onClick={() => setActiveTab('portfolio')}>
        Go to Portfolio
      </Button>
    </div>
  );
};

// ============================================================================
// ANIMATION EXAMPLES
// ============================================================================

export const AnimationExamples = () => (
  <div className="space-y-6">
    {/* Fade In */}
    <div className="animate-fade-in">
      <Card glassy>
        <div className="p-6">Fade In Animation</div>
      </Card>
    </div>

    {/* Slide Up */}
    <div className="animate-slide-up">
      <Card glassy>
        <div className="p-6">Slide Up Animation</div>
      </Card>
    </div>

    {/* Float */}
    <div className="animate-float">
      <Card glassy>
        <div className="p-6">Float Animation</div>
      </Card>
    </div>

    {/* Pulse Soft */}
    <div className="animate-pulse-soft">
      <Card glassy>
        <div className="p-6">Pulse Animation</div>
      </Card>
    </div>
  </div>
);

// ============================================================================
// COLOR & DESIGN TOKEN USAGE
// ============================================================================

export const ColorTokensExample = () => (
  <div className="space-y-4">
    {/* Gradient text */}
    <h1 className="text-4xl font-bold gradient-text">
      Gradient Text Example
    </h1>

    {/* Gradient background */}
    <div className="bg-gradient-brand text-white p-6 rounded-2xl">
      Brand Gradient Background
    </div>

    {/* Hero gradient */}
    <div className="bg-gradient-hero text-white p-6 rounded-2xl">
      Hero Gradient Background
    </div>

    {/* Subtle gradient */}
    <div className="bg-gradient-subtle p-6 rounded-2xl border border-indigo-200">
      Subtle Gradient Background
    </div>

    {/* Glass effect */}
    <div className="glass p-6 rounded-2xl">
      Glass Effect (backdrop blur + transparency)
    </div>
  </div>
);

// ============================================================================
// RESPONSIVE DESIGN EXAMPLE
// ============================================================================

export const ResponsiveExample = () => (
  <div className="w-full">
    {/* Mobile: single column, Tablet: 2 columns, Desktop: 3 columns */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card glassy>
        <div className="p-6">Column 1</div>
      </Card>
      <Card glassy>
        <div className="p-6">Column 2</div>
      </Card>
      <Card glassy>
        <div className="p-6">Column 3 (hidden on mobile)</div>
      </Card>
    </div>
  </div>
);

export default {
  ButtonPrimaryExample,
  CardBasicExample,
  InputBasicExample,
  TextareaBasicExample,
  BadgeBasicExample,
  UploadBoxExample,
  ResumeFormExample,
  ThreePanelLayoutExample,
  StateManagementExample,
  AnimationExamples,
  ColorTokensExample,
  ResponsiveExample,
};
