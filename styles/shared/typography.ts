import styled, { css } from "styled-components/native";

import { ThemedProps } from "./types";

export const Title = styled.Text`
  ${({ theme }: ThemedProps) => css`
    color: ${theme.colors.text};
    font-family: ${theme.typography.bodyBold};
    font-size: 24px;
  `}
`;

export const Body = styled.Text`
  ${({ theme }: ThemedProps) => css`
    color: ${theme.colors.muted};
    font-family: ${theme.typography.body};
    font-size: 16px;
    line-height: 22px;
  `}
`;
