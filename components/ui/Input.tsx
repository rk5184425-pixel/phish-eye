import React from 'react';
import { TextInput, View, Text } from 'react-native';
import { cn } from '../lib/utils';

interface InputProps {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
  numberOfLines?: number;
  className?: string;
  label?: string;
}

export function Input({
  value,
  onChangeText,
  placeholder,
  multiline = false,
  numberOfLines = 1,
  className,
  label,
}: InputProps) {
  return (
    <View className="w-full">
      {label && (
        <Text className="text-sm font-medium text-foreground mb-2">
          {label}
        </Text>
      )}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#64748b"
        multiline={multiline}
        numberOfLines={numberOfLines}
        className={cn(
          'w-full rounded-md border border-input bg-background px-3 py-2 text-base text-foreground',
          multiline && 'min-h-[80px] text-top',
          className
        )}
        style={{
          textAlignVertical: multiline ? 'top' : 'center',
        }}
      />
    </View>
  );
}