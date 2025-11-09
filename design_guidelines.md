# EmpaAI Design Guidelines

## Design Approach

**Selected System:** Material Design with Accessibility-First Enhancements

**Rationale:** EmpaAI requires a robust, utility-focused design system that prioritizes accessibility, real-time data presentation, and complex video processing interfaces. Material Design provides excellent accessibility foundations, clear component patterns for forms and data display, and established interaction models that ensure consistency across the dual-dashboard experience.

**Core Principles:**
1. Accessibility above aesthetics - WCAG 2.1 AA compliance minimum
2. Clear visual hierarchy for complex real-time features
3. Generous spacing to accommodate assistive technologies
4. Immediate feedback for all AI processing states

---

## Typography

**Font System:**
- Primary: Inter (via Google Fonts CDN)
- Weights: 400 (regular), 600 (semibold), 700 (bold)

**Hierarchy:**
- H1: text-5xl font-bold (Landing hero, dashboard titles)
- H2: text-4xl font-bold (Section headings)
- H3: text-2xl font-semibold (Component headers, video section titles)
- H4: text-xl font-semibold (Feature cards, questionnaire sections)
- Body: text-base (Standard content, form labels)
- Small: text-sm (Captions, helper text, real-time subtitle display)
- Micro: text-xs (Timestamps, metadata)

**Accessibility Requirements:**
- Minimum body text: 16px (text-base)
- Line height: leading-relaxed (1.625) for all body text
- Letter spacing: tracking-normal (default)
- All text must pass 4.5:1 contrast ratio minimum

---

## Layout System

**Spacing Primitives:** Consistent use of Tailwind units: 2, 4, 6, 8, 12, 16, 24

**Application:**
- Component padding: p-6 (cards), p-8 (sections)
- Section spacing: py-16 (desktop), py-12 (mobile)
- Element gaps: gap-4 (form fields), gap-8 (feature cards)
- Container margins: mx-auto with max-w-7xl

**Grid System:**
- Landing page: 3-column grid (lg:grid-cols-3) for feature cards
- Disabled dashboard: 2-column split - video processing (left 60%), real-time outputs (right 40%)
- Non-disabled dashboard: Asymmetric split - questionnaire (left 40%), webcam/analysis (right 60%)
- Mobile: Single column (grid-cols-1) for all layouts

**Responsive Breakpoints:**
- Mobile: base (< 640px)
- Tablet: md (768px)
- Desktop: lg (1024px)

---

## Component Library

### Navigation
**Primary Header:**
- Horizontal bar with EmpaAI logo (left), navigation links (center), profile/logout (right)
- Height: h-16, fixed positioning with shadow-md
- Mobile: Hamburger menu (right-aligned) with slide-out drawer
- High contrast mode toggle integrated into header

### Authentication Pages
**Layout:**
- Centered card design: max-w-md mx-auto, p-8
- Form fields: Full-width inputs with generous spacing (space-y-6)
- Radio buttons for user type: Large touch targets (min 44x44px), labeled with icons
- CTAs: Primary button (full-width), secondary text link below

### Landing Page
**Hero Section:**
- Full-width banner with background gradient overlay
- Large hero image showing accessibility/communication (diverse users, sign language, technology)
- Centered content: H1 headline, subheadline (text-xl), dual CTA buttons (Sign Up primary, Learn More secondary)
- Height: min-h-screen with content vertically centered

**Feature Grid:**
- 3-column grid showcasing dual user experiences
- Each card: Icon (top), H3 title, description (text-base), decorative accent border-l-4
- Spacing: p-6 per card, gap-8 between cards

**Social Proof Section:**
- 2-column layout: Testimonial cards (left), statistics display (right)
- Statistics: Large numbers (text-5xl font-bold) with labels

**CTA Section:**
- Centered design with generous padding (py-24)
- Prominent headline + primary action button

### Disabled User Dashboard
**Video Processing Area (Left 60%):**
- Large video preview: Rounded corners (rounded-lg), shadow-lg
- Upload/Record controls: Button group below video (gap-4)
- Full-screen toggle: Overlay button (top-right corner of video)
- Video container: aspect-video ratio, bg-gray-100 when empty

**Real-Time Output Panel (Right 40%):**
- Stacked sections with clear dividers (divide-y)
- Sign language emojis: Grid display (grid-cols-4), large size (text-6xl)
- Translation output: Text cards with language flags, rounded-lg bg-blue-50
- Live captions: Fixed-height scrollable area (h-48), monospace font, YouTube-style appearance
- Download button: Positioned bottom-right, with icon (Heroicons download)

**Loading States:**
- Skeleton loaders for AI processing
- Progress indicators for video upload
- Pulsing animation for active detection

### Non-Disabled User Dashboard
**Questionnaire Form (Left 40%):**
- Vertical form layout with question numbering
- Mix of input types: radio groups, select dropdowns, range sliders
- Visual progress indicator (top): Stepped progress bar showing 6 steps
- Submit button: Sticky at bottom with subtle shadow

**Webcam/Analysis Area (Right 60%):**
- Webcam toggle: Large toggle switch with privacy icon
- Live feed: aspect-video, rounded-lg, placeholder when disabled
- Mood analysis: Overlay cards displaying detected emotion with emoji + confidence percentage
- Wellness recommendations: Modal dialog (max-w-lg) with icon, headline, bulleted suggestions

**Analytics Section (Bottom):**
- Pie chart visualization: Canvas-based, legend positioned right
- Chart container: p-8, rounded-lg, shadow-md
- Responsive sizing: Full-width mobile, max-w-2xl desktop

### Profile Page
**Layout:**
- 2-column: User info/settings (left), account actions (right)
- Form fields: Labeled inputs with edit icons
- Settings: Toggle switches for preferences
- Danger zone: Bordered section (border-red-500) for account deletion

### Help Page
**Structure:**
- Sidebar navigation (left 25%): Sticky positioned, category links
- Content area (right 75%): Scrollable accordion sections
- Video tutorials: Embedded players (aspect-video)
- FAQ: Expandable cards with chevron icons (Heroicons)

---

## Interactive Elements

**Buttons:**
- Primary: Large touch target (min h-12), rounded-md, font-semibold
- Secondary: Outlined variant, same dimensions
- Icon buttons: Square (h-10 w-10), rounded-full for circular style
- Disabled state: Opacity-50, cursor-not-allowed

**Form Inputs:**
- Height: h-12 for text inputs, consistent across all fields
- Borders: border-2 for focus visibility
- Labels: Above input, text-sm font-medium
- Error states: Red border, error text below (text-sm text-red-600)

**Cards:**
- Standard padding: p-6
- Border radius: rounded-lg
- Elevation: shadow-md for primary cards, shadow-sm for nested
- Hover states: Subtle lift (hover:shadow-lg transition)

**Modals/Dialogs:**
- Centered overlay with backdrop (bg-black/50)
- Content container: max-w-lg, p-8, rounded-xl
- Close button: Top-right corner, clear X icon

---

## Accessibility Features

**Keyboard Navigation:**
- All interactive elements must have visible focus states (ring-2 ring-offset-2)
- Logical tab order following visual hierarchy
- Skip-to-content link for screen readers

**Screen Reader Support:**
- ARIA labels for all icons and non-text elements
- Live regions for real-time updates (captions, mood analysis)
- Descriptive alt text for all images

**Visual Accessibility:**
- High contrast mode toggle affecting entire interface
- Large touch targets (minimum 44x44px) throughout
- No color-only information conveyance

---

## Images

**Hero Image (Landing Page):**
- Description: Diverse group of people communicating using sign language and technology, inclusive setting with laptops/tablets visible, warm and welcoming atmosphere
- Placement: Full-width background for hero section with gradient overlay (from-blue-900/40 to-transparent)
- Treatment: Slightly blurred background to maintain text readability

**Feature Section Images:**
- Description: Three supporting images showing: 1) Person using sign language with AI detection overlay, 2) Wellness/meditation scene with person looking peaceful, 3) Technology interface showing real-time captions
- Placement: Within feature cards as visual anchors
- Treatment: Rounded-lg, aspect-square, object-cover

**Dashboard Placeholders:**
- Video preview placeholders: Icon-based with upload/record prompts
- Webcam disabled state: Privacy icon with explanatory text
- Empty state illustrations: Friendly, minimalist style encouraging first action

---

## Animation Strategy

**Minimal, Purposeful Animations:**
- Page transitions: Simple fade-in (duration-200)
- Loading states: Pulse animation for skeletons
- Real-time updates: Subtle slide-in for new captions (translate-y-2)
- Modal entry/exit: Scale + fade combination (duration-300)
- No scroll-triggered or decorative animations

**Focus: Immediate Responsiveness**
- Prioritize instant visual feedback over flashy effects
- All animations respect prefers-reduced-motion user settings