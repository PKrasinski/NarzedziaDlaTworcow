# Atomic Components Specification

## Overview

This specification defines the atomic component pattern for the design system, focusing on contextual, semantic components that automatically adapt to their parent context.

## Core Principles

### 1. Context-Driven Sizing

Components automatically inherit sizing from their parent context via React Context, eliminating prop drilling.

```tsx
// ❌ Old approach - manual prop passing
<SidebarMenuButton size="compact">...</SidebarMenuButton>

// ✅ New approach - context inheritance
<SidebarProvider size="compact">
  <SidebarMenuButton>...</SidebarMenuButton> // Automatically compact
</SidebarProvider>
```

### 2. Semantic Atom Components

Create specialized atomic components for common UI patterns with built-in styling and semantic meaning.

```tsx
// ❌ Generic implementation
<h1 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
  Title
</h1>

// ✅ Semantic atom component
<SidebarTitle>Title</SidebarTitle>
```

### 3. Single Responsibility

Each atomic component has one clear purpose and adapts contextually without external configuration.

## Implementation Pattern

### Context Setup

```tsx
type ComponentContext = {
  size: "compact" | "default" | "comfortable";
  // other contextual properties
};

const ComponentContext = React.createContext<ComponentContext | null>(null);
```

### Atomic Component Structure

```tsx
const AtomicComponent = React.forwardRef<HTMLElement, Props>(
  ({ className, ...props }, ref) => {
    const { size } = useContext(); // Get from context

    const sizeStyles = {
      compact: "...",
      default: "...",
      comfortable: "...",
    };

    return (
      <Element
        ref={ref}
        className={cn(baseStyles, sizeStyles[size], className)}
        {...props}
      />
    );
  }
);
```

## Component Export Pattern

### Grouped Exports

Components are exported as a const object to enable simplified provider setup:

```tsx
export const sidebarComponents = {
  Sidebar,
  SidebarTitle,
  SidebarDescription,
  // ... all related components
} as const;
```

### Provider Integration

The design system provider uses spread operator to include all components:

```tsx
const designSystemComponents = {
  Button,
  ...sidebarComponents,
} as const;
```

## Benefits

1. **Consistency**: Automatic styling inheritance ensures visual consistency
2. **Performance**: Context-driven rendering reduces prop drilling
3. **Maintainability**: Single source of truth for component styling
4. **Developer Experience**: Semantic components are self-documenting
5. **Flexibility**: Easy to override with className when needed

## Usage Examples

### Basic Context Usage

```tsx
<SidebarProvider size="compact">
  <SidebarHeader>
    <SidebarTitle>Project Name</SidebarTitle>
    <SidebarDescription>Brief description here</SidebarDescription>
  </SidebarHeader>
</SidebarProvider>
```

### With Provider Overrides

```tsx
<DesignSystemProvider overrides={{ SidebarTitle: CustomTitle }}>
  <App />
</DesignSystemProvider>
```

### Auto-Active Links

```tsx
<SidebarMenuButton href="/dashboard" variant="gradient">
  <Icon />
  Dashboard
</SidebarMenuButton>
// Automatically detects if current route matches href
```
