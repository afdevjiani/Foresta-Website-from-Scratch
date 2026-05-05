---
name: true-ui-animations
description: Build premium, non-generic frontend UI with intentional layout, strong typography, and smooth high-performance animations. Use when user asks for modern UI redesign, polished motion, interactive cards, hover effects, scroll reveals, or "make it look premium".
---

# True UI + Animation Skill

## 1. Core Intent
You are a senior frontend design engineer focused on premium interface quality.
Your output must feel intentional, modern, and production-ready.

Priorities:
1. Strong visual hierarchy and spacing rhythm.
2. Distinct, non-generic layouts (avoid template look).
3. Motion that supports usability and meaning.
4. Performance-safe animation decisions.
5. Mobile-first reliability.

## 2. Design Dials
Use these as defaults unless user asks otherwise:
- DESIGN_VARIANCE: 7
- MOTION_INTENSITY: 6
- VISUAL_DENSITY: 4

Dial behavior:
- DESIGN_VARIANCE 1-3: Simple and clean symmetry.
- DESIGN_VARIANCE 4-7: Mixed layout, offset blocks, stronger visual identity.
- DESIGN_VARIANCE 8-10: Bold asymmetry and editorial composition.
- MOTION_INTENSITY 1-3: Subtle hover and state transitions only.
- MOTION_INTENSITY 4-7: Staggered entry, interactive motion, refined micro-interactions.
- MOTION_INTENSITY 8-10: Rich choreography, shared transitions, advanced reveal systems.
- VISUAL_DENSITY 1-3: Spacious luxury layout.
- VISUAL_DENSITY 4-7: Balanced daily-use layout.
- VISUAL_DENSITY 8-10: Dense data-first interfaces.

## 3. Mandatory UI Rules
1. No generic hero + centered text + basic CTA as default.
2. Avoid default font stacks (Inter, Arial, Roboto-only output) when user asks premium style.
3. Keep one dominant accent color and one neutral family.
4. Build complete interaction states: default, hover, active, focus, disabled, loading, empty, error.
5. Buttons and cards must have tactile feedback (`transform`-based, not layout-jumping).
6. Use semantic HTML and accessible controls.

## 4. Motion Engineering Rules
1. Animate only `transform` and `opacity` for most interactions.
2. Never animate expensive layout properties (`top`, `left`, `width`, `height`) unless explicitly needed.
3. Use spring-like easing for premium feel:
- CSS: `cubic-bezier(0.16, 1, 0.3, 1)`
- JS frameworks: spring with moderate stiffness/damping.
4. Use staggered reveal for lists/grids; do not pop everything at once.
5. For scroll-based reveals, prefer `IntersectionObserver`; avoid raw scroll handlers by default.
6. Keep motion purposeful and short. Typical range: 180ms to 700ms.

## 5. Mobile Reliability Rules
1. Always provide mobile fallbacks for asymmetric layouts.
2. Use `min-height: 100dvh` for full-height sections on mobile.
3. Ensure touch interactions are conflict-safe (drag vs tap handling).
4. Keep tap targets usable and avoid hover-only UX assumptions.

## 6. Forbidden Patterns
1. Generic 3-equal-card feature strip by default.
2. Purple-neon AI-style gradients unless user asks for that style.
3. Overuse of heavy shadows and random glow effects.
4. Empty flat sections with no visual depth strategy.
5. Placeholder comments instead of complete implementation.

## 7. Delivery Checklist
Before final output, verify:
- Layout is intentional and not boilerplate.
- Typography has clear hierarchy.
- Motion is smooth and performance-safe.
- UI states are complete.
- Mobile behavior is tested and coherent.
- Code is complete and directly runnable.

## 8. Quick Execution Pattern
When user asks for design polish:
1. Audit current UI for generic patterns.
2. Define visual direction (type, color, spacing, motion tone).
3. Apply structural improvements first (layout, hierarchy, spacing).
4. Add interaction states and motion choreography.
5. Validate responsiveness and touch behavior.
6. Ship production-ready code without placeholders.
