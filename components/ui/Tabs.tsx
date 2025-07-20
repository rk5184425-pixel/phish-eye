import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { cn } from '../lib/utils';

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

const TabsContext = React.createContext<{
  value: string;
  onValueChange: (value: string) => void;
}>({
  value: '',
  onValueChange: () => {},
});

export function Tabs({ value, onValueChange, children, className }: TabsProps) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <View className={cn('w-full', className)}>
        {children}
      </View>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className }: TabsListProps) {
  return (
    <View className={cn('inline-flex h-10 items-center justify-center rounded-md bg-muted p-1', className)}>
      {children}
    </View>
  );
}

export function TabsTrigger({ value: triggerValue, children, className }: TabsTriggerProps) {
  const { value, onValueChange } = React.useContext(TabsContext);
  const isActive = value === triggerValue;

  return (
    <TouchableOpacity
      onPress={() => onValueChange(triggerValue)}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all',
        isActive ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground',
        className
      )}
    >
      <Text className={cn('text-sm font-medium', isActive ? 'text-foreground' : 'text-muted-foreground')}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

export function TabsContent({ value: contentValue, children, className }: TabsContentProps) {
  const { value } = React.useContext(TabsContext);
  
  if (value !== contentValue) {
    return null;
  }

  return (
    <View className={cn('mt-2', className)}>
      {children}
    </View>
  );
}