/* eslint-disable import/no-named-as-default */
import React from "react";
import { Platform, StyleProp, StyleSheet, TextInputProps, TextStyle, ViewStyle } from "react-native";
import styled from "styled-components/native";

import { ThemedProps } from "@/components/ui/shared";

const StyledInput = styled.TextInput.attrs({
  underlineColorAndroid: "transparent",
})<TextInputProps & ThemedProps>`
  border-width: 1px;
  border-color: ${({ theme }: ThemedProps) => theme.colors.border};
  background-color: transparent;
  color: ${({ theme }: ThemedProps) => theme.colors.text};
  padding: ${({ theme }: ThemedProps) => theme.spacing(1)}px;
  border-radius: ${({ theme }: ThemedProps) => theme.radius.sm}px;
  margin-bottom: ${({ theme }: ThemedProps) => theme.spacing(1)}px;
`;

type InputProps = TextInputProps & {
  label?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
};

export const Input: React.FC<InputProps> = ({ label, containerStyle, inputStyle, labelStyle, ...props }) => {
  const inputProps: TextInputProps = {
    // default behavior for forms: no auto-capitalization and no autocorrect
    autoCapitalize: (props as any).autoCapitalize ?? "none",
    autoCorrect: (props as any).autoCorrect ?? false,
    underlineColorAndroid: (props as any).underlineColorAndroid ?? "transparent",
    ...(props as TextInputProps),
  };
  const flattenedInputStyle = inputStyle ? StyleSheet.flatten(inputStyle) : undefined;
  const useAndroidReset =
    Platform.OS === "android" &&
    !!flattenedInputStyle &&
    !!flattenedInputStyle.borderBottomWidth &&
    !flattenedInputStyle.borderWidth;
  const androidResetStyle = useAndroidReset
    ? {
        borderWidth: 0,
        borderBottomWidth: 0,
        paddingVertical: 0,
        backgroundColor: "transparent",
      }
    : null;
  const composedStyle = inputStyle ? [androidResetStyle, inputStyle] : androidResetStyle;

  return (
    <InputWrapper style={containerStyle}>
      {label ? <Label style={labelStyle}>{label}</Label> : null}
      <StyledInput {...inputProps} style={composedStyle} placeholder={props.placeholder ?? ""} />
    </InputWrapper>
  );
};

const InputWrapper = styled.View``;

export const Row = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }: ThemedProps) => theme.spacing(1)}px;
`;

export const Spacer = styled.View`
  height: ${({ theme }: ThemedProps) => theme.spacing(1)}px;
`;

export const PrimaryButton = styled.TouchableOpacity`
  background-color: ${({ theme }: ThemedProps) => theme.colors.primary};
  padding: ${({ theme }: ThemedProps) => theme.spacing(1.5)}px;
  border-radius: 24px;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 53px;
`;

export const SecondaryButton = styled(PrimaryButton)`
  background-color: ${({ theme }: ThemedProps) => theme.colors.secondary};
`;

export const GhostButton = styled.TouchableOpacity`
  padding: ${({ theme }: ThemedProps) => theme.spacing(1)}px;
`;

export const ButtonText = styled.Text`
  color: ${({ theme }: ThemedProps) => theme.colors.text};
  font-family: ${({ theme }: ThemedProps) => theme.typography.bodyBold};
  font-weight: 700;
  font-size: 18px;
`;

export const GhostText = styled.Text`
  color: ${({ theme }: ThemedProps) => theme.colors.secondary};
  font-family: ${({ theme }: ThemedProps) => theme.typography.bodyBold};
  font-weight: 700;
`;

export const ToggleRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }: ThemedProps) => theme.spacing(1)}px;
  padding-vertical: ${({ theme }: ThemedProps) => theme.spacing(0.5)}px;
`;

const CheckboxBox = styled.View`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border-width: 1px;
  border-color: ${({ theme }: ThemedProps) => theme.colors.border};
  align-items: center;
  justify-content: center;
`;

export const Checkbox: React.FC<{
  label?: string;
  value?: boolean;
  onValueChange?: (v: boolean) => void;
  children?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  boxStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
}> = ({ label, value = false, onValueChange, children, containerStyle, boxStyle, labelStyle }) => {
  if (children) {
    // compatibility: allow rendering raw checkbox text content like before
    const normalizedContent =
      typeof children === "string" ? <Label style={labelStyle}>{children}</Label> : children;
    return <ToggleRow style={containerStyle}>{normalizedContent}</ToggleRow>;
  }

  return (
    <ToggleRow style={containerStyle} onPress={() => onValueChange && onValueChange(!value)}>
      <CheckboxBox style={boxStyle}>{value ? <FilledBox /> : null}</CheckboxBox>
      {label ? <Label style={labelStyle}>{label}</Label> : null}
    </ToggleRow>
  );
};

const FilledBox = styled.View`
  width: 12px;
  height: 12px;
  background-color: ${({ theme }: ThemedProps) => theme.colors.primary};
  border-radius: 2px;
`;

export const InfoBanner = styled.Text`
  background-color: #eaf8f2;
  border-radius: ${({ theme }: ThemedProps) => theme.radius.sm}px;
  padding: ${({ theme }: ThemedProps) => theme.spacing(1)}px;
  color: ${({ theme }: ThemedProps) => theme.colors.text};
  font-family: ${({ theme }: ThemedProps) => theme.typography.body};
  margin-bottom: ${({ theme }: ThemedProps) => theme.spacing(1)}px;
`;

export const ErrorBanner = styled.Text`
  background-color: #f9e3e2;
  border-radius: ${({ theme }: ThemedProps) => theme.radius.sm}px;
  padding: ${({ theme }: ThemedProps) => theme.spacing(1)}px;
  color: #9b1c1c;
  font-family: ${({ theme }: ThemedProps) => theme.typography.body};
  margin-bottom: ${({ theme }: ThemedProps) => theme.spacing(1)}px;
`;

export const Label = styled.Text`
  color: ${({ theme }: ThemedProps) => theme.colors.muted};
  font-family: ${({ theme }: ThemedProps) => theme.typography.bodyBold};
  margin-bottom: ${({ theme }: ThemedProps) => theme.spacing(0.5)}px;
`;

export const ErrorText = styled.Text`
  color: #9b1c1c;
  font-family: ${({ theme }: ThemedProps) => theme.typography.body};
  margin-bottom: ${({ theme }: ThemedProps) => theme.spacing(1)}px;
`;
