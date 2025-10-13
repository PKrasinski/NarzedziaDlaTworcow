# Design System Refactoring Specification

## Overview

This specification defines the process for refactoring React components across `@narzedziadlatworcow.pl` and `@businessmodelfirst.com` applications into a unified design system workspace at `packages/design-system`. The new design system follows shadcn/ui patterns with CVA (Class Variance Authority) standardization.

## Package Structure

The design system workspace is configured as:

```
packages/design-system/
├── package.json           # Workspace package configuration
├── components.json        # Shadcn/ui configuration
├── ai/                   # AI specifications and documentation
│   └── design-system-refactoring-spec.md
├── components/           # All reusable components
│   ├── ui/              # Core shadcn/ui components
│   └── index.ts         # Main exports
├── hooks/               # Shared React hooks
├── lib/                 # Utility functions
├── styles/              # Global styles and CSS
└── tsconfig.json        # TypeScript configuration
```

## Bun Workspace Integration

### Package Name
- Workspace name: `design-system`
- Import as: `import { Button } from "design-system/components"`

### Installation
Components from this workspace can be imported in any app within the monorepo:

```typescript
// In any app's package.json dependencies
{
  "design-system": "workspace:*"
}
```

### Import Patterns
```typescript
// Import components
import { Button, Card, Dialog } from "design-system/components"
import { Button } from "design-system/components/ui/button"

// Import hooks
import { useToast } from "design-system/hooks"

// Import utilities
import { cn } from "design-system/lib/utils"
```

## Component Refactoring Workflow

### Phase 1: Component Discovery and Analysis

1. **User Initiates Refactoring**
   ```
   User: "I want to refactor Button components"
   ```

2. **Automated Component Search**
   The agent uses search tools to find all button-like components:
   ```bash
   # Search patterns
   - *.tsx files containing "button" (case-insensitive)
   - className patterns with button-like styles
   - Component names containing "Button", "Btn", etc.
   - HTML button elements with custom styling
   ```

3. **Analysis and Grouping**
   Agent analyzes found components and groups them by:
   - **Visual similarity**: Colors, sizes, styles
   - **Functional similarity**: Props, behaviors
   - **Usage patterns**: How they're used across apps

4. **Present Findings to User**
   ```
   Agent: "Found 23 button instances across both apps:
   
   Group 1: Primary buttons (8 instances)
   - apps/narzedziadlatworcow.pl/platform/src/components/ui/button.tsx (primary variant)
   - apps/businessmodelfirst.com/web/components/hover-button.tsx
   - [other instances...]
   
   Group 2: Secondary/Outline buttons (7 instances)
   - [instances...]
   
   Group 3: Icon buttons (5 instances)
   - [instances...]
   
   Group 4: Special buttons (3 instances)
   - [instances...]
   
   Would you like me to refactor all groups or specific ones?"
   ```

### Phase 2: Component Standardization

1. **User Selection**
   User chooses which groups to refactor:
   ```
   User: "Refactor groups 1, 2, and 3. For group 4, show me consolidation options."
   ```

2. **Consolidation Proposals**
   For similar but not identical components:
   ```
   Agent: "Group 4 can be consolidated into 2 variants:
   
   Option A: Create 'special' variant in main Button component
   - Keeps all current visual differences as CVA variants
   - Props: variant='special-primary' | 'special-secondary' | 'special-danger'
   
   Option B: Create separate SpecialButton component
   - Maintains unique functionality
   - Inherits base Button styles but with custom behavior
   
   Which approach do you prefer?"
   ```

3. **DesignSystemProvider Pattern & Semantic CVA Variants**
   **CRITICAL**: The design system must use a provider pattern for easy component overrides in future projects, and all variants must use SEMANTIC NAMES (function-based) not visual names.

   Process:
   a) **DesignSystemProvider Architecture**:
   ```typescript
   // Context-based component injection for easy override
   const DesignSystemProvider = ({ children, overrides = {} }) => {
     const components = useMemo(() => ({
       Button: overrides.Button || DefaultButton,
       // Other components...
     }), [overrides])
     
     return (
       <DesignSystemContext.Provider value={components}>
         {children}
       </DesignSystemContext.Provider>
     )
   }

   // High-performance hook with component memoization
   const useDesignSystem = () => {
     const context = useContext(DesignSystemContext)
     if (!context) throw new Error('useDesignSystem must be used within DesignSystemProvider')
     return context
   }
   ```

   b) **Semantic CVA Structure** (FUNCTION-BASED NAMES ONLY):
   ```typescript
   const buttonVariants = cva(
     "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
     {
       variants: {
         variant: {
           // ✅ SEMANTIC NAMES (function-based) - CORRECT
           primary: "bg-blue-600 hover:bg-blue-700 text-white",
           secondary: "bg-gray-200 hover:bg-gray-300 text-gray-900",
           cta: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white", // Call-to-action
           continue: "bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white", // Continue/next steps
           danger: "bg-red-500 hover:bg-red-600 text-white",
           success: "bg-green-500 hover:bg-green-600 text-white",
           outline: "border-2 border-gray-300 hover:border-gray-400 bg-transparent",
           ghost: "hover:bg-gray-100 text-gray-700",
           link: "text-blue-600 hover:text-blue-700 underline-offset-4 hover:underline bg-transparent",
           
           // ❌ NEVER use visual names like:
           // "gradient-blue-purple", "blue-button", "large-shadow" - WRONG!
         },
         size: {
           sm: "h-8 px-3 text-sm",
           default: "h-10 px-4 text-sm",
           lg: "h-12 px-6 text-base", 
           xl: "h-14 px-8 text-base",
           icon: "h-10 w-10 p-0",
         },
         radius: {
           none: "rounded-none",
           sm: "rounded-sm",
           default: "rounded-md",
           lg: "rounded-lg", 
           xl: "rounded-xl",
           "2xl": "rounded-2xl",
           full: "rounded-full",
         },
         shadow: {
           none: "shadow-none",
           sm: "shadow-sm", 
           default: "shadow-md",
           lg: "shadow-lg hover:shadow-xl",
           xl: "shadow-xl hover:shadow-2xl",
         },
         animation: {
           none: "",
           scale: "transform hover:scale-105",
           lift: "transform hover:-translate-y-0.5",
         }
       },
       defaultVariants: {
         variant: "primary",
         size: "default",
         radius: "default",
         shadow: "default", 
         animation: "none",
       },
     }
   )
   ```

   c) **Usage Pattern**:
   ```typescript
   // ✅ CORRECT - Using provider pattern
   const { Button } = useDesignSystem()
   
   <Button 
     variant="continue"  // Semantic name
     radius="lg"
     shadow="lg"
     animation="scale"
     className="w-full" // Only layout utilities allowed
   >
     Next Step
   </Button>
   ```

   d) **Strict Rules**:
   - **Semantic naming only**: `cta`, `continue`, `primary` - NOT `gradient-blue`, `large-button`
   - **Provider pattern required**: All components accessed via `useDesignSystem()`
   - **Layout utilities only**: `className` can only contain layout utilities like `w-full`, `self-start`
   - **No visual styling in className**: All visual styling must use CVA variants

### Phase 3: Component Creation

1. **Create New Design System Component**
   ```typescript
   // packages/design-system/components/ui/button.tsx
   import { Slot } from "@radix-ui/react-slot"
   import { cva, type VariantProps } from "class-variance-authority"
   import * as React from "react"
   import { cn } from "../../lib/utils"

   const buttonVariants = cva(
     // Base styles consolidated from both apps
     // CVA variants as defined above
   )

   export interface ButtonProps
     extends React.ButtonHTMLAttributes<HTMLButtonElement>,
       VariantProps<typeof buttonVariants> {
     asChild?: boolean
   }

   const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
     ({ className, variant, size, asChild = false, ...props }, ref) => {
       const Comp = asChild ? Slot : "button"
       return (
         <Comp
           className={cn(buttonVariants({ variant, size, className }))}
           ref={ref}
           {...props}
         />
       )
     }
   )
   Button.displayName = "Button"

   export { Button, buttonVariants }
   ```

2. **Update Component Exports**
   ```typescript
   // packages/design-system/components/index.ts
   export { Button, buttonVariants } from "./ui/button"
   // ... other exports
   ```

### Phase 4: Systematic Replacement

1. **Create Replacement Plan**
   ```
   Agent: "Creating replacement plan for 15 button instances:
   
   ✓ Replace apps/narzedziadlatworcow.pl/platform/src/components/ui/button.tsx
     - Import: design-system/components
     - Variant mapping: primary -> variant="primary"
   
   ✓ Replace apps/businessmodelfirst.com/web/components/hover-button.tsx
     - Import: design-system/components  
     - Additional props: Add hover animation class
     
   [Continue for all instances...]
   
   Proceed with replacements?"
   ```

2. **Execute Replacements**
   For each instance:
   - Update import statements
   - Map old props to new CVA variants
   - Preserve any custom functionality
   - Update TypeScript types if needed

3. **Remove Old Components**
   After successful replacement:
   - Delete old component files
   - Update any re-exports
   - Clean up unused dependencies

### Phase 5: Validation and Testing

1. **Build Verification**
   ```bash
   # Run builds for all affected apps
   bun run --cwd apps/narzedziadlatworcow.pl/platform build
   bun run --cwd apps/businessmodelfirst.com/web build
   ```

2. **Type Checking**
   ```bash
   # Verify TypeScript compilation
   bun run --cwd packages/design-system typecheck
   ```

3. **Visual Verification**
   Agent provides guidance:
   ```
   Agent: "Please verify visual consistency:
   
   1. Check apps/narzedziadlatworcow.pl/platform - all buttons should maintain their appearance
   2. Check apps/businessmodelfirst.com/web - hover effects should work correctly
   3. Test responsive behavior on different screen sizes
   
   Any visual regressions found?"
   ```

## Component Standardization Guidelines

### CVA Standards

All components must follow CVA patterns:

```typescript
// Standard CVA structure
const componentVariants = cva(
  "base-classes-here", // Base styles common to all variants
  {
    variants: {
      variant: {
        default: "default-variant-styles",
        primary: "primary-variant-styles",
        // ... other variants
      },
      size: {
        sm: "small-size-styles",
        default: "default-size-styles",
        lg: "large-size-styles",
      },
      // Additional variant dimensions as needed
    },
    compoundVariants: [
      // For complex variant combinations
      {
        variant: "primary",
        size: "lg",
        className: "special-combination-styles"
      }
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

### Props Standardization

#### Common Props Pattern
```typescript
export interface ComponentProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof componentVariants> {
  asChild?: boolean // For Radix Slot compatibility
  children?: React.ReactNode
}
```

#### Variant Naming Convention
- Use semantic names: `primary`, `secondary`, `destructive`
- Avoid presentational names: `red`, `blue`, `large`
- Use size variants: `sm`, `default`, `lg`, `xl`

### Style Consolidation Rules

1. **Preserve Visual Consistency**
   - Maintain existing visual appearance during refactoring
   - Only consolidate truly similar components

2. **Progressive Enhancement**
   - Start with basic variants
   - Add specialized variants as needed
   - Keep compound variants for complex cases

3. **Accessibility First**
   - Maintain all existing accessibility features
   - Follow ARIA best practices
   - Ensure keyboard navigation works

## Component Discovery Patterns

### Search Patterns for Different Component Types

#### Buttons
```typescript
// File patterns
"**/*{button,btn}*.{tsx,ts}"
"**/components/**/*.{tsx,ts}" // Search in component directories

// Content patterns
- /button|btn/i (case-insensitive)
- /className.*["'].*button/
- /<button\s+/
- /type=['"]button['"]/
```

#### Form Components
```typescript
// File patterns
"**/*{input,form,field}*.{tsx,ts}"

// Content patterns  
- /input|field|form/i
- /<input\s+/
- /TextField|FormField|InputField/
```

#### Layout Components
```typescript
// File patterns
"**/*{card,container,layout,grid}*.{tsx,ts}"

// Content patterns
- /card|container|layout|grid/i
- /className.*["'].*card|container/
```

### Similarity Detection Algorithm

1. **Visual Similarity** (70% weight)
   - Compare className patterns
   - Analyze Tailwind/CSS classes
   - Match color schemes and sizing

2. **Structural Similarity** (20% weight)
   - Compare prop interfaces
   - Analyze component composition
   - Match HTML structure

3. **Functional Similarity** (10% weight)
   - Compare event handlers
   - Analyze business logic
   - Match component behavior

## New View Development Guidelines

### Using the Design System for New Components

#### 1. Start with Existing Components
```typescript
// Always check if component exists first
import { Button, Card, Input } from "design-system/components"

function NewFeature() {
  return (
    <Card className="p-6">
      <Input placeholder="Search..." />
      <Button variant="primary">Submit</Button>
    </Card>
  )
}
```

#### 2. Extending Existing Components
```typescript
// For minor customizations, use className
import { Button } from "design-system/components"

function CustomButton() {
  return (
    <Button 
      variant="primary" 
      className="shadow-2xl animate-pulse" // Add custom styles
    >
      Special Button
    </Button>
  )
}
```

#### 3. Creating New Components
When existing components don't meet needs:

```typescript
// Create in local components directory first
// packages/design-system/components/ui/special-widget.tsx

import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const specialWidgetVariants = cva(
  "base-widget-styles",
  {
    variants: {
      type: {
        primary: "primary-widget-styles",
        secondary: "secondary-widget-styles",
      },
      size: {
        sm: "small-widget-styles",
        default: "default-widget-styles",
        lg: "large-widget-styles",
      }
    },
    defaultVariants: {
      type: "primary",
      size: "default",
    },
  }
)

export interface SpecialWidgetProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof specialWidgetVariants> {
  title: string
}

export function SpecialWidget({ 
  className, 
  type, 
  size, 
  title,
  ...props 
}: SpecialWidgetProps) {
  return (
    <div 
      className={cn(specialWidgetVariants({ type, size, className }))}
      {...props}
    >
      <h3>{title}</h3>
      {/* Widget content */}
    </div>
  )
}
```

#### 4. Integration with Arc Framework
For narzedziadlatworcow.pl apps using Arc framework:

```typescript
// Use design system components in Arc-powered components
import { Button } from "design-system/components"
import { useArcCommand } from "@arcote.tech/arc-react"

function ArcEnabledForm() {
  const { execute } = useArcCommand("create-item")
  
  return (
    <form onSubmit={() => execute({ name: "test" })}>
      <Button type="submit" variant="primary">
        Create Item
      </Button>
    </form>
  )
}
```

### Development Workflow for New Views

1. **Planning Phase**
   - Identify required components
   - Check design system for existing components
   - Plan any new components needed

2. **Implementation Phase**
   - Use existing design system components
   - Create custom components only when necessary
   - Follow CVA patterns for any new components

3. **Review Phase**
   - Check if new components should be added to design system
   - Ensure consistency with existing design patterns
   - Test across different screen sizes

## Agent Interaction Examples

### Example 1: Button Refactoring
```
User: "Refactor all button components to use the design system"

Agent: "Searching for button components across both applications..."

[Agent uses Grep and Glob tools to find all button-related files]

Agent: "Found 23 button instances:
- 8 primary action buttons
- 7 secondary/outline buttons  
- 5 icon-only buttons
- 3 special purpose buttons (delete, submit, cancel)

Would you like me to consolidate these into a single Button component with variants, or should some remain separate?"

User: "Consolidate the first three groups, keep special buttons separate for now"

Agent: "I'll create a Button component with these variants:
- variant: 'primary' | 'secondary' | 'outline' | 'ghost'
- size: 'sm' | 'default' | 'lg' | 'icon'

Creating component now..."

[Agent creates the Button component]

Agent: "Button component created. Now replacing 20 instances across both apps. This will:
1. Update import statements
2. Map old props to new CVA variants  
3. Preserve existing functionality
4. Remove old button files

Proceed with replacement?"

User: "Yes, proceed"

[Agent systematically replaces all instances]

Agent: "Replacement complete. Running builds to verify..."
[Agent runs build commands]

Agent: "✅ All builds successful. Button refactoring complete."
```

### Example 2: Component Consolidation
```
User: "I want to standardize all our card components"

Agent: "Analyzing card components... Found variations:
1. Product cards (5 instances) - different but could be unified
2. Info cards (3 instances) - very similar
3. Dashboard cards (4 instances) - unique styling

For Product cards, I can create variants for:
- variant: 'product' | 'info' | 'dashboard'
- size: 'compact' | 'default' | 'expanded'

This would reduce 12 different implementations to 1 component with 9 possible combinations. Proceed?"

User: "Show me the specific mapping first"

Agent: "Here's how each current card maps to the new variants:

apps/narzedziadlatworcow.pl/platform/src/components/product-card.tsx
→ <Card variant="product" size="default" />

apps/businessmodelfirst.com/web/components/persona-card.tsx  
→ <Card variant="info" size="compact" />

[continues for all instances...]

This preserves all current styling while unifying the API. Approve mapping?"
```

## Best Practices

### For Refactoring
1. **Incremental Approach**: Refactor one component type at a time
2. **Visual Verification**: Always check visual consistency after changes
3. **Build Validation**: Run builds after each refactoring step
4. **User Confirmation**: Always confirm with user before making changes

### For New Development
1. **Design System First**: Check existing components before creating new ones
2. **CVA Patterns**: Follow established patterns for all new components
3. **Accessibility**: Maintain accessibility standards
4. **Documentation**: Document any new patterns or components

### For Maintenance
1. **Regular Audits**: Periodically review for new consolidation opportunities
2. **Pattern Updates**: Keep CVA patterns consistent across all components
3. **Version Control**: Use semantic versioning for design system changes
4. **Testing**: Maintain visual regression tests where possible

## Troubleshooting

### Common Issues

1. **Import Errors**
   ```typescript
   // Wrong
   import { Button } from "@design-system/ui"
   
   // Correct
   import { Button } from "design-system/components"
   ```

2. **Style Conflicts**
   - Use `cn()` utility to merge classes properly
   - Check for conflicting Tailwind classes
   - Verify CSS specificity issues

3. **TypeScript Errors**
   - Ensure proper variant types are exported
   - Check prop interface compatibility
   - Verify forwardRef typing

4. **Build Errors**
   - Check workspace dependencies are correctly configured
   - Verify all exports are properly defined
   - Ensure TypeScript paths are correct

### Recovery Procedures

If refactoring causes issues:

1. **Revert Changes**: Use git to revert to previous working state
2. **Incremental Fix**: Fix one component at a time
3. **Manual Verification**: Check each refactored component manually
4. **Build Testing**: Test builds frequently during recovery

This specification provides a comprehensive framework for systematically refactoring components into a unified design system while maintaining functionality and visual consistency across both applications.