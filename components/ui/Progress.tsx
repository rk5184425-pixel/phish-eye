import React from 'react';
import { View, StyleSheet } from 'react-native';

interface ProgressProps {
  value: number;
  style?: any;
}

export function Progress({ value, style }: ProgressProps) {
  const progressValue = Math.min(100, Math.max(0, value));
  
  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.progress,
          { width: `${progressValue}%` }
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 16,
    width: '100%',
    backgroundColor: '#64748b',
    borderRadius: 8,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: '#22c55e',
    borderRadius: 8,
  },
});