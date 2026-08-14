import React from 'react';
import { StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';

interface InputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  multiline?: boolean;
  error?: boolean;
  disabled?: boolean;
  style?: any;
}

export default function Input({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType = 'default',
  multiline,
  error,
  disabled,
  style,
}: InputProps) {
  return (
    <TextInput
      label={label}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      multiline={multiline}
      error={error}
      disabled={disabled}
      mode="outlined"
      style={[styles.input, style]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    marginVertical: 6,
    backgroundColor: '#fff',
  },
});
