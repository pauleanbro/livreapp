import "styled-components/native";

import { AppTheme } from "./styles/theme";

declare module "styled-components/native" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends AppTheme {}
}
