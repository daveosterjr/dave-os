import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';
import { cn } from '@/lib/utils';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
};

export function Button({ asChild, className, variant = 'primary', ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50',
        variant === 'primary' && 'bg-foreground text-background hover:opacity-90',
        variant === 'secondary' && 'bg-muted text-foreground hover:bg-muted/80',
        variant === 'ghost' && 'hover:bg-muted',
        className
      )}
      {...props}
    />
  );
}
