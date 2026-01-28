'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';
import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-red-600 text-white hover:bg-red-700',
        outline: 'text-foreground',
        success: 'border-transparent bg-green-600 text-white hover:bg-green-700',
        warning: 'border-transparent bg-amber-500 text-white hover:bg-amber-600',
        danger: 'border-transparent bg-red-600 text-white hover:bg-red-700',
        info: 'border-transparent bg-blue-500 text-white hover:bg-blue-600',
        glass: 'glass text-white border-white/20',
        gradient:
          'bg-gradient-to-r from-primary to-secondary text-white border-transparent',
      },
      size: {
        default: 'px-2.5 py-0.5 text-xs',
        sm: 'px-2 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
        xl: 'px-4 py-1.5 text-base',
      },
      pulse: {
        none: '',
        subtle: 'animate-pulse',
        ring: 'pulse-ring',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      pulse: 'none',
    },
  },
);

type OmittedHTMLDivAttributes = Omit<React.HTMLAttributes<HTMLDivElement>, 'onDrag' | 'onDragEnd' | 'onDragStart' | 'onDragOver' | 'onDragEnter' | 'onDragLeave' | 'onDrop' | 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration'>;

export interface BadgeProps
  extends OmittedHTMLDivAttributes,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean;
  as?: React.ElementType;
  icon?: React.ReactNode;
  count?: number | string;
  dot?: boolean;
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  (
    { className, variant, size, pulse, icon, count, dot, children, ...props },
    ref,
  ) => {
    const Component = motion.div;

    return (
      <Component
        className={cn(badgeVariants({ variant, size, pulse }), className)}
        ref={ref}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        {...props}
      >
        {dot && <span className="mr-1 h-2 w-2 rounded-full bg-current" />}
        {icon && <span className="mr-1">{icon}</span>}
        {count !== undefined ? count : children}
      </Component>
    );
  },
);

Badge.displayName = 'Badge';

export { Badge, badgeVariants };
