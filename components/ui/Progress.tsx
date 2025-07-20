import React from 'react';
import { View } from 'react-native';
import { cn } from '../lib/utils';

interface ProgressProps {
  value: number;
  className?: string;
}

export function Progress({ value, className }: ProgressProps) {
  return (
    <View className={cn('relative h-4 w-full overflow-hidden rounded-full bg-secondary', className)}>
      <View
        className="h-full bg-primary transition-all"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </View>
  );
}