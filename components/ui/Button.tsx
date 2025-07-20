import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';

interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'scan' | 'danger' | 'warning' | 'safe';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  loading?: boolean;
  style?: any;
}

export function Button({
  children,
  onPress,
  variant = 'default',
  size = 'default',
  disabled = false,
  loading = false,
  style,
}: ButtonProps) {
  const getButtonStyle = () => {
    const baseStyle = [styles.button];
    
    // Variant styles
    switch (variant) {
      case 'destructive':
        baseStyle.push(styles.destructive);
        break;
      case 'outline':
        baseStyle.push(styles.outline);
        break;
      case 'secondary':
        baseStyle.push(styles.secondary);
        break;
      case 'ghost':
        baseStyle.push(styles.ghost);
        break;
      case 'scan':
        baseStyle.push(styles.scan);
        break;
      case 'danger':
        baseStyle.push(styles.danger);
        break;
      case 'warning':
        baseStyle.push(styles.warning);
        break;
      case 'safe':
        baseStyle.push(styles.safe);
        break;
      default:
        baseStyle.push(styles.default);
    }
    
    // Size styles
    switch (size) {
      case 'sm':
        baseStyle.push(styles.sm);
        break;
      case 'lg':
        baseStyle.push(styles.lg);
        break;
      case 'icon':
        baseStyle.push(styles.icon);
        break;
      default:
        baseStyle.push(styles.defaultSize);
    }
    
    if (disabled) {
      baseStyle.push(styles.disabled);
    }
    
    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle = [styles.text];
    
    switch (variant) {
      case 'outline':
        baseStyle.push(styles.outlineText);
        break;
      case 'ghost':
        baseStyle.push(styles.ghostText);
        break;
      default:
        baseStyle.push(styles.defaultText);
    }
    
    switch (size) {
      case 'sm':
        baseStyle.push(styles.smText);
        break;
      case 'lg':
        baseStyle.push(styles.lgText);
        break;
    }
    
    return baseStyle;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[...getButtonStyle(), style]}
    >
      {loading ? (
        <ActivityIndicator color="white" size="small" />
      ) : (
        <Text style={getTextStyle()}>
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  default: {
    backgroundColor: '#22c55e',
  },
  destructive: {
    backgroundColor: '#ef4444',
  },
  outline: {
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: 'transparent',
  },
  secondary: {
    backgroundColor: '#64748b',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  scan: {
    backgroundColor: '#22c55e',
  },
  danger: {
    backgroundColor: '#ef4444',
  },
  warning: {
    backgroundColor: '#f59e0b',
  },
  safe: {
    backgroundColor: '#22c55e',
  },
  defaultSize: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sm: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  lg: {
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  icon: {
    padding: 12,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: '500',
    textAlign: 'center',
  },
  defaultText: {
    color: '#ffffff',
    fontSize: 16,
  },
  outlineText: {
    color: '#f1f5f9',
    fontSize: 16,
  },
  ghostText: {
    color: '#f1f5f9',
    fontSize: 16,
  },
  smText: {
    fontSize: 14,
  },
  lgText: {
    fontSize: 18,
  },
});