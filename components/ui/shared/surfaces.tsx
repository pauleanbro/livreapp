import { css, styled } from "styled-components/native";

import { ThemedProps } from "./types";

export const Card = styled.View`
  ${({ theme }: ThemedProps) => css`
    background-color: ${theme.colors.surface};
    border-radius: ${theme.radius.md}px;
    border-width: 1px;
    border-color: ${theme.colors.border};
    padding: ${theme.spacing(2)}px;
  `}
`;
