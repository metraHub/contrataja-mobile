import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { colors, radius } from '../../theme/colors';

interface ButtonProps {
  label: string;
  onPress: () => void;
  mode?: 'contained' | 'outlined' | 'text';
  loading?: boolean;
  disabled?: boolean;
  style?: any;
}

export default function Button({
  label,
  onPress,
  mode = 'contained',
  loading = false,
  disabled = false,
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  if (mode === 'text') {
    return (
      <TouchableOpacity
        style={[styles.textButton, style]}
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.7}
      >
        <Text style={[styles.textLabel, isDisabled && styles.disabledText]}>
          {loading ? 'Aguarde...' : label}
        </Text>
      </TouchableOpacity>
    );
  }

  if (mode === 'outlined') {
    return (
      <TouchableOpacity
        style={[styles.outlinedButton, isDisabled && styles.disabled, style]}
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.8}
      >
        <Text style={[styles.outlinedLabel, isDisabled && styles.disabledText]}>
          {loading ? 'Aguarde...' : label}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.button, isDisabled && styles.disabled, style]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      <Text style={styles.label}>
        {loading ? 'Aguarde...' : label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginVertical: 6,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    color: colors.textOnAccent,
    fontSize: 16,
    fontWeight: '600',
  },
  outlinedButton: {
    borderWidth: 1.5,
    borderColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginVertical: 6,
  },
  outlinedLabel: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '600',
  },
  textButton: {
    paddingVertical: 10,
    alignItems: 'center',
    marginVertical: 4,
  },
  textLabel: {
    color: colors.accent,
    fontSize: 15,
    fontWeight: '600',
  },
  disabledText: {
    opacity: 0.5,
  },
});
