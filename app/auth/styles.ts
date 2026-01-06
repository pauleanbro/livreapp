/* eslint-disable import/no-named-as-default */
import { Card, ThemedProps } from "@/components/ui/shared";
import styled from "styled-components/native";

export const BackgroundView = styled.View`
  flex: 1;
  justify-content: space-between;
  align-items: center;
  background-color: #f7faf8;
`;

export const ContentView = styled.View`
  flex: 1;
  width: 100%;
  padding: ${({ theme }: ThemedProps) => theme.spacing(3)}px;
  align-items: center;
  justify-content: space-between;
`;

export const Middle = styled.View`
  flex: 1;
  width: 100%;
  justify-content: center;
  align-items: flex-start;
`;

export const Bottom = styled.View`
  width: 100%;
  align-items: center;
`;

export const TitleBlock = styled.View`
  width: 100%;
  margin-bottom: ${({ theme }: ThemedProps) => theme.spacing(2)}px;
`;

export const HeaderRow = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  margin-bottom: ${({ theme }: ThemedProps) => theme.spacing(1)}px;
`;

export const BackButton = styled.TouchableOpacity`
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background-color: rgba(11, 47, 45, 0.08);
  align-items: center;
  justify-content: center;
`;

export const TitleRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0px;
`;

export const TitleLead = styled.Text`
  color: #0b2f2d;
  font-size: 26px;
  line-height: 32px;
  font-family: ${({ theme }: ThemedProps) => theme.typography.headingRegular};
`;

export const TitleHighlight = styled.Text`
  color: #027e68;
  font-size: 28px;
  line-height: 34px;
  font-family: ${({ theme }: ThemedProps) => theme.typography.heading};
`;

export const TitleSubtitle = styled.Text`
  color: rgba(6, 77, 76, 0.6);
  font-size: 14px;
  line-height: 20px;
  margin-top: ${({ theme }: ThemedProps) => theme.spacing(1)}px;
  font-family: ${({ theme }: ThemedProps) => theme.typography.body};
`;

export const Form = styled.View`
  width: 100%;
`;

export const HeaderDivider = styled.View`
  height: 1px;
  width: 100%;
  background-color: rgba(6, 77, 76, 0.1);
  margin-bottom: ${({ theme }: ThemedProps) => theme.spacing(3)}px;
`;

export const FormCard = styled(Card)`
  width: 100%;
  border-radius: ${({ theme }: ThemedProps) => theme.radius.lg}px;
  border-color: #dcede7;
  background-color: #ffffff;
  padding: ${({ theme }: ThemedProps) => theme.spacing(2)}px;
  gap: ${({ theme }: ThemedProps) => theme.spacing(1)}px;
`;

export const FormGroup = styled.View`
  gap: ${({ theme }: ThemedProps) => theme.spacing(1)}px;
`;

export const CheckboxRow = styled.View`
  margin-top: ${({ theme }: ThemedProps) => theme.spacing(1)}px;
  padding-top: ${({ theme }: ThemedProps) => theme.spacing(0.5)}px;
`;

export const Support = styled.View`
  margin-vertical: ${({ theme }: ThemedProps) => theme.spacing(2)}px;
  align-items: center;
  margin-bottom: ${({ theme }: ThemedProps) => theme.spacing(4)}px;
`;

export const Link = styled.TouchableOpacity``;

export const LinkText = styled.Text`
  color: #027e68;
  font-family: ${({ theme }: ThemedProps) => theme.typography.body};
  text-decoration-line: underline;
  margin-top: 8px;
`;

export const SupportText = styled.Text`
  color: #0b2f2d;
  font-family: ${({ theme }: ThemedProps) => theme.typography.bodyBold};
  font-size: 14px;
  text-align: center;
`;

export const PrimaryCta = styled.TouchableOpacity`
  background-color: #027e68;
  border-radius: 16px;
  height: 56px;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  padding: 0 ${({ theme }: ThemedProps) => theme.spacing(2)}px;
  width: 100%;
  overflow: hidden;
`;

export const PrimaryCtaLabel = styled.Text`
  color: #ffffff;
  font-size: 16px;
  font-family: ${({ theme }: ThemedProps) => theme.typography.bodyBold};
`;

export default {};
