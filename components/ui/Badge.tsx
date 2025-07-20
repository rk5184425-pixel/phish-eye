import React from 'react';
import { View, Text } from 'react-native';
import { cn } from '../lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  className?: string;
}

const badgeVariants = {
  default: 'bg-primary',
  secondary: 'bg-secondary',
  destructive: 'bg-destructive',
  outline: 'border border-input bg-transparent',
};

const textVariants = {
  default: 'text-primary-foreground',
  secondary: 'text-secondary-foreground',
  destructive: 'text-destructive-foreground',
  outline: 'text-foreground',
};

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <View
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5',
        badgeVariants[variant],
        className
      )}
    >
      <Text
        className={cn(
          'text-xs font-semibold',
          textVariants[variant]
        )}
      >
        {children}
      </Text>
    </View>
  );
}