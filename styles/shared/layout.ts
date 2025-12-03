import styled from "styled-components/native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedProps } from "./types";

export const Screen = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }: ThemedProps) => theme.colors.background};
`;

export const Content = styled.View`
  flex: 1;
  padding: ${({ theme }: ThemedProps) => theme.spacing(2)}px;
`;
