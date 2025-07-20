import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { cn } from '../lib/utils';

interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'scan' | 'danger' | 'warning' | 'safe';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

const buttonVariants = {
  variant: {
    default: 'bg-primary',
    destructive: 'bg-destructive',
    outline: 'border border-input bg-transparent',
    secondary: 'bg-secondary',
    ghost: 'bg-transparent',
    scan: 'bg-primary',
    danger: 'bg-danger',
    warning: 'bg-warning',
    safe: 'bg-safe',
  },
  size: {
    default: 'px-4 py-3',
    sm: 'px-3 py-2',
    lg: 'px-8 py-4',
    icon: 'p-3',
  },
};

const textVariants = {
  variant: {
    default: 'text-primary-foreground',
    destructive: 'text-destructive-foreground',
    outline: 'text-foreground',
    secondary: 'text-secondary-foreground',
    ghost: 'text-foreground',
    scan: 'text-primary-foreground',
    danger: 'text-danger-foreground',
    warning: 'text-warning-foreground',
    safe: 'text-safe-foreground',
  },
  size: {
    default: 'text-base',
    sm: 'text-sm',
    lg: 'text-lg',
    icon: 'text-base',
  },
};

export function Button({
  children,
  onPress,
  variant = 'default',
  size = 'default',
  disabled = false,
  loading = false,
  className,
}: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={cn(
        'rounded-md items-center justify-center flex-row',
        buttonVariants.variant[variant],
        buttonVariants.size[size],
        disabled && 'opacity-50',
        className
      )}
    >
      {loading ? (
        <ActivityIndicator color="white" size="small" />
      ) : (
        <Text
          className={cn(
            'font-medium text-center',
            textVariants.variant[variant],
            textVariants.size[size]
          )}
        >
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
}