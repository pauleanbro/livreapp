import { ThemedProps } from "@/styles/shared";
import styled from "styled-components/native";

export const BackgroundView = styled.View`
  flex: 1;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ theme }: ThemedProps) => theme.colors.background};
`;

export const ContentView = styled.View`
  flex: 1;
  width: 100%;
  padding-left: 36px;
  padding-right: 36px;
  align-items: center;
  justify-content: space-between;
`;

export const Middle = styled.View`
  flex: 1;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

export const Bottom = styled.View`
  width: 100%;
  align-items: center;
`;

export const TitleLarge = styled.Text`
  color: #EEFFEF;
  font-size: 37px;
  font-family: ${({ theme }: ThemedProps) => theme.typography.bodyBold};
  width: 100%;
  margin-bottom: 16px;
`;

export const Form = styled.View`
  width: 100%;
`;

export const FormGroup = styled.View`
  gap: 8px;
  margin-bottom: 16px;
`;

export const CheckboxRow = styled.View`
  margin-top: 8px;
`;

export const Support = styled.View`
  margin-vertical: 16px;
  align-items: center;
  margin-bottom: 60px;
`;

export const SupportText = styled.Text`
  color: #EEFFEF;
  font-family: ${({ theme }: ThemedProps) => theme.typography.bodyBold};
  font-size: 14px;
  text-align: center;
`;

export const Link = styled.TouchableOpacity``;

export const LinkText = styled.Text`
  color: #EEFFEF;
  font-family: ${({ theme }: ThemedProps) => theme.typography.body};
  text-decoration-line: underline;
  margin-top: 8px;
`;

export const ButtonWrapper = styled.View`
  width: 100%;
  padding-left: 36px;
  padding-right: 36px;
  align-items: center;
`;

export default {};
