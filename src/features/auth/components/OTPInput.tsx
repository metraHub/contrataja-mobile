import React, { useRef, useEffect } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { colors, radius } from '../../../theme/colors';

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (code: string) => void;
}

export default function OTPInput({ length = 6, value, onChange }: OTPInputProps) {
  const inputs = useRef<(TextInput | null)[]>([]);
  const digits = value.split('').concat(Array(length).fill('')).slice(0, length);

  useEffect(() => {
    // Auto-focus first input on mount
    setTimeout(() => inputs.current[0]?.focus(), 100);
  }, []);

  const handleChange = (text: string, index: number) => {
    // Only allow single digit
    const digit = text.replace(/\D/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[index] = digit;
    const newCode = newDigits.join('').slice(0, length);
    onChange(newCode);

    // Auto-focus next field
    if (digit && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
      // Go back to previous field on backspace if current is empty
      const newDigits = [...digits];
      newDigits[index - 1] = '';
      onChange(newDigits.join('').slice(0, length));
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={s.container}>
      {Array.from({ length }).map((_, i) => {
        const isFilled = !!digits[i];
        const isFocusable = i === value.length || (i === length - 1 && value.length === length);

        return (
          <TextInput
            key={i}
            ref={(ref) => { inputs.current[i] = ref; }}
            style={[s.box, isFilled && s.boxFilled]}
            value={digits[i]}
            onChangeText={(text) => handleChange(text, i)}
            onKeyPress={(e) => handleKeyPress(e, i)}
            keyboardType="number-pad"
            maxLength={1}
            selectTextOnFocus
            caretHidden
          />
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  box: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: radius.md,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    color: colors.text,
    backgroundColor: colors.surface,
  },
  boxFilled: {
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft,
  },
});
