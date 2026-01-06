import { ImageBackground } from "react-native";
import styled from "styled-components/native";

import { ThemedProps } from "@/components/ui/shared";

export const Background = styled(ImageBackground)`
  flex: 1;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

export const Container = styled.View`
  position: relative;
  align-items: center;
  width: 100%;
    paddingHorizontal: ${({ theme }: ThemedProps) => theme.spacing(2)}px;
  height: 537px;
`;

export const Card = styled.View`
  width: 100%;
  height: 100%;
  justify-content: flex-end;
  align-items: center;
  border-radius: 24px;
  overflow: hidden;
`;

export const CardImage = styled(ImageBackground).attrs(({ theme }: ThemedProps) => ({
  resizeMode: "cover",
  imageStyle: { borderRadius: 24 },
}))`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
`;

export const Inner = styled.View`
  width: 100%;
  padding: 25px;
`;

export const Title = styled.Text.attrs({
  lineBreakMode: "wordWrap",
  lineBreakStrategyIOS: "none",
  textBreakStrategy: "simple",
})`
  color: #ffffff;
  font-size: 37px;
  font-family: ${({ theme }: ThemedProps) => theme.typography.bodyBold};
  width: 85%;
  margin-bottom: 20px;
`;

export const Logo = styled(ImageBackground)`
  position: absolute;
  width: 102px;
  height: 102px;
  top: -50px;
  right: 30px;
`;

export const OutlineButton = styled.TouchableOpacity`
  border-width: 1px;
  border-color: #ffffff;
  padding: ${({ theme }: ThemedProps) => theme.spacing(1)}px;
  border-radius: 24px;
  align-items: center;
  height: 53px;
  justify-content: center;
  margin-top: 8px;
`;

export default {};
