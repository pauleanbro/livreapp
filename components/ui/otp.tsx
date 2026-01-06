import React, { useImperativeHandle, useMemo, useRef } from "react";
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputKeyPressEventData,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

type OTPInputProps = {
  value?: string;
  length?: number;
  onChange?: (value: string) => void;
  containerStyle?: StyleProp<ViewStyle>;
  cellStyle?: StyleProp<TextStyle>;
  inputProps?: TextInputProps;
  autoFocus?: boolean;
};

const DEFAULT_LENGTH = 6;

export const OTPInput = React.forwardRef<TextInput, OTPInputProps>(
  ({ value = "", length = DEFAULT_LENGTH, onChange, containerStyle, cellStyle, inputProps, autoFocus }, ref) => {
    const inputs = useRef<(TextInput | null)[]>([]);

    useImperativeHandle(ref, () => inputs.current[0] as TextInput, []);

    const characters = useMemo(() => {
      return Array.from({ length }, (_, index) => value[index] ?? "");
    }, [value, length]);

    const focusCell = (index: number) => {
      const target = inputs.current[index];
      if (target) {
        target.focus();
      }
    };

    const notifyChange = (updated: string[]) => {
      onChange?.(updated.join(""));
    };

    const handleTextChange = (text: string, index: number) => {
      const cleaned = text.replace(/\D/g, "").slice(0, 1);
      const updated = [...characters];
      updated[index] = cleaned;
      notifyChange(updated);
      if (cleaned && index + 1 < length) {
        focusCell(index + 1);
      }
    };

    const handleKeyPress = (event: TextInputKeyPressEventData, index: number) => {
      if (event.nativeEvent.key !== "Backspace") return;
      if (characters[index]) return;
      if (index === 0) return;
      focusCell(index - 1);
    };

    return (
      <View style={[styles.container, containerStyle]}>
        {characters.map((char, index) => (
          <TextInput
            key={`otp-${index}`}
            ref={(input) => {
              inputs.current[index] = input;
            }}
            value={char}
            onChangeText={(text) => handleTextChange(text, index)}
            onKeyPress={(event) => handleKeyPress(event, index)}
            keyboardType="numeric"
            maxLength={1}
            returnKeyType="next"
            textAlign="center"
            style={[
              styles.cell,
              cellStyle,
              index < length - 1 ? { marginRight: 8 } : undefined,
            ]}
            autoFocus={autoFocus && index === 0}
            {...inputProps}
          />
        ))}
      </View>
    );
  }
);

OTPInput.displayName = "OTPInput";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cell: {
    flexBasis: 0,
    flexGrow: 1,
    flexShrink: 1,
    maxWidth: 48,
    height: 56,
    borderWidth: 1,
    borderColor: "#B6DAD0",
    borderRadius: 10,
    fontSize: 20,
    fontWeight: "600",
  },
});
