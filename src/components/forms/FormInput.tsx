import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';
import { Controller, Control } from 'react-hook-form';
import { colors, spacing, radius } from '../../theme/colors';

interface FormInputProps {
  name: string;
  control: Control<any>;
  label: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  multiline?: boolean;
  numberOfLines?: number;
  rules?: any;
}

export default function FormInput({
  name,
  control,
  label,
  placeholder,
  secureTextEntry,
  keyboardType = 'default',
  multiline,
  numberOfLines,
}: FormInputProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View style={styles.container}>
          <TextInput
            label={label}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            multiline={multiline}
            numberOfLines={numberOfLines}
            error={!!error}
            mode="outlined"
            style={styles.input}
            outlineStyle={styles.outline}
            activeOutlineColor={colors.accent}
            outlineColor={colors.border}
            textColor={colors.text}
          />
          {error && (
            <HelperText type="error" visible style={styles.error}>
              {error.message}
            </HelperText>
          )}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  input: {
    backgroundColor: colors.surface,
    fontSize: 15,
  },
  outline: {
    borderRadius: radius.md,
  },
  error: {
    color: colors.error,
    paddingLeft: 4,
  },
});
