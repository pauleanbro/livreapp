/* eslint-disable import/no-named-as-default */
import { ImageBackground } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import styled from "styled-components/native";

import { Input } from "@/components/ui/controls";
import { Body, Card, ThemedProps, Title } from "@/components/ui/shared";

export const MainContent = styled.View`
  flex: 1;
`;

export const ContentPadding = styled.View`
  padding: 0 ${({ theme }: ThemedProps) => theme.spacing(2)}px;
`;

export const OnboardingHeader = styled.View`
  padding-top: ${({ theme }: ThemedProps) => theme.spacing(1.5)}px;
  padding-bottom: ${({ theme }: ThemedProps) => theme.spacing(2)}px;
`;

export const OnboardingTopRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const StepText = styled.Text`
  color: rgba(6, 77, 76, 0.6);
  font-size: 12px;
  letter-spacing: 1px;
  font-family: ${({ theme }: ThemedProps) => theme.typography.bodyBold};
`;

export const ProgressTrack = styled.View`
  height: 4px;
  width: 100%;
  border-radius: 999px;
  background-color: rgba(6, 77, 76, 0.12);
  margin-top: ${({ theme }: ThemedProps) => theme.spacing(1)}px;
`;

export const ProgressFill = styled.View`
  height: 4px;
  border-radius: 999px;
  background-color: #027e68;
`;

export const HeaderDivider = styled.View`
  height: 1px;
  width: 100%;
  background-color: rgba(6, 77, 76, 0.1);
  margin-top: ${({ theme }: ThemedProps) => theme.spacing(1.25)}px;
`;

export const QuestionBlock = styled.View`
  margin-top: ${({ theme }: ThemedProps) => theme.spacing(2)}px;
`;

export const QuestionRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  align-items: baseline;
  gap: ${({ theme }: ThemedProps) => theme.spacing(0.5)}px;
`;

export const QuestionLead = styled.Text`
  font-size: 24px;
  line-height: 30px;
  color: #0b2f2d;
  font-family: ${({ theme }: ThemedProps) => theme.typography.headingRegular};
`;

export const QuestionHighlight = styled.Text`
  font-size: 26px;
  line-height: 32px;
  color: #027e68;
  font-family: ${({ theme }: ThemedProps) => theme.typography.heading};
`;

export const QuestionSubtitle = styled(Body)`
  margin-top: ${({ theme }: ThemedProps) => theme.spacing(0.8)}px;
  color: rgba(6, 77, 76, 0.6);
  font-size: 14px;
  line-height: 20px;
`;

export const InputBlock = styled.View`
  margin-top: ${({ theme }: ThemedProps) => theme.spacing(2)}px;
`;

export const TipList = styled.View`
  margin-top: ${({ theme }: ThemedProps) => theme.spacing(1)}px;
  gap: ${({ theme }: ThemedProps) => theme.spacing(1)}px;
`;

export const TipItem = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }: ThemedProps) => theme.spacing(1)}px;
  padding: ${({ theme }: ThemedProps) => theme.spacing(1.25)}px;
  border-radius: ${({ theme }: ThemedProps) => theme.radius.md}px;
  background-color: rgba(2, 126, 104, 0.06);
  border-width: 1px;
  border-color: rgba(2, 126, 104, 0.16);
`;

export const TipIcon = styled.View`
  width: 28px;
  height: 28px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  background-color: rgba(2, 126, 104, 0.16);
`;

export const TipText = styled(Body)`
  flex: 1;
  flex-shrink: 1;
  color: rgba(6, 77, 76, 0.7);
  font-size: 14px;
  line-height: 20px;
`;

export const CtaButton = styled.TouchableOpacity`
  background-color: #027e68;
  border-radius: 16px;
  height: 56px;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  padding: 0 ${({ theme }: ThemedProps) => theme.spacing(2)}px;
  overflow: hidden;
  elevation: 3;
  shadow-color: #027e68;
  shadow-opacity: 0.25;
  shadow-radius: 16px;
  shadow-offset: 0px 8px;
`;

export const CtaLabel = styled.Text`
  color: #ffffff;
  font-size: 16px;
  font-family: ${({ theme }: ThemedProps) => theme.typography.bodyBold};
`;

export const HeroCard = styled.View`
  width: 100%;
  background-color: transparent;
  border-radius: 0px;
  border-bottom-left-radius: ${({ theme }: ThemedProps) => theme.radius.lg}px;
  border-bottom-right-radius: ${({ theme }: ThemedProps) => theme.radius.lg}px;
  padding: ${({ theme }: ThemedProps) => theme.spacing(3)}px;
  padding-top: ${({ theme }: ThemedProps) => theme.spacing(4)}px;
  padding-bottom: ${({ theme }: ThemedProps) => theme.spacing(3.5)}px;
  margin-top: 0px;
  margin-bottom: ${({ theme }: ThemedProps) => theme.spacing(3)}px;
  elevation: 2;
  shadow-color: #000;
  shadow-opacity: 0.08;
  shadow-radius: 14px;
  shadow-offset: 0px 8px;
  overflow: hidden;
`;

export const HeroBackRow = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }: ThemedProps) => theme.spacing(1)}px;
`;

export const HeroBadge = styled(Body)`
  align-self: flex-start;
  padding: ${({ theme }: ThemedProps) => theme.spacing(0.4)}px ${({ theme }: ThemedProps) =>
    theme.spacing(1.4)}px;
  border-radius: 999px;
  background-color: rgba(255, 255, 255, 0.18);
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.35);
  color: #f4fffb;
  font-size: 11px;
  letter-spacing: 0.6px;
`;

export const HeroTitle = styled(Title)`
  margin-top: ${({ theme }: ThemedProps) => theme.spacing(1.5)}px;
  color: #ffffff;
  font-size: 28px;
  line-height: 34px;
`;

export const HeroSubtitle = styled(Body)`
  margin-top: ${({ theme }: ThemedProps) => theme.spacing(1)}px;
  color: rgba(255, 255, 255, 0.78);
  font-size: 15px;
  line-height: 21px;
`;

export const HeroBackButton = styled.TouchableOpacity`
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.2);
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.3);
  align-items: center;
  justify-content: center;
`;

export const HeroPattern = styled(ImageBackground)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #0f3d3a;
  opacity: 0.88;
  border-radius: 0px;
  border-bottom-left-radius: ${({ theme }: ThemedProps) => theme.radius.lg}px;
  border-bottom-right-radius: ${({ theme }: ThemedProps) => theme.radius.lg}px;
  z-index: -1;
`;

export const HeaderSheet = styled.View`
  background-color: transparent;
  border-radius: ${({ theme }: ThemedProps) => theme.radius.lg}px;
  padding: 0px;
`;

export const HeaderCard = styled.View`
  background-color: #ffffff;
  border-radius: ${({ theme }: ThemedProps) => theme.radius.lg}px;
  padding: ${({ theme }: ThemedProps) => theme.spacing(2)}px;
  elevation: 2;
  shadow-color: #0f5660;
  shadow-opacity: 0.06;
  shadow-radius: 14px;
  shadow-offset: 0px 6px;
`;

export const HeaderTopRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }: ThemedProps) => theme.spacing(1)}px;
`;

export const HeaderBottomRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }: ThemedProps) => theme.spacing(1)}px;
  margin-top: ${({ theme }: ThemedProps) => theme.spacing(1)}px;
  justify-content: space-between;
`;

export const IconHolder = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background-color: rgba(15, 86, 96, 0.12);
  align-items: center;
  justify-content: center;
`;

export const HeaderTitleBlock = styled.View`
  flex: 1;
`;

export const HeaderTitle = styled(Title)`
  font-size: 18px;
  color: #064d4c;
`;

export const HeaderSubtitle = styled(Body)`
  opacity: 0.8;
  margin-left: ${({ theme }: ThemedProps) => theme.spacing(1)}px;
`;

export const StepBadge = styled(Body)`
  font-weight: 700;
  font-size: 12px;
  color: #ffffff;
  background-color: #0f3d3a;
  padding: 4px 10px;
  border-radius: 999px;
`;

export const ScrollArea = styled(KeyboardAwareScrollView).attrs(() => ({
  contentContainerStyle: {
    paddingTop: 0,
    paddingBottom: 160,
    flexGrow: 1,
  },
  keyboardShouldPersistTaps: "handled",
  keyboardDismissMode: "on-drag",
  bottomOffset: 90,
  stickyHeaderIndices: [0],
}))`
  flex: 1;
  width: 100%;
`;

export const FormCard = styled(Card)`
  padding: ${({ theme }: ThemedProps) => theme.spacing(3)}px;
  border-radius: ${({ theme }: ThemedProps) => theme.radius.lg}px;
  gap: ${({ theme }: ThemedProps) => theme.spacing(1)}px;
  elevation: 2;
  shadow-color: #000;
  shadow-opacity: 0.06;
  shadow-radius: 14px;
  shadow-offset: 0px 6px;
`;

export const DateField = styled.TouchableOpacity`
  border-width: 0px;
  border-bottom-width: 1.5px;
  border-bottom-color: #0f5660;
  background-color: transparent;
  padding-top: ${({ theme }: ThemedProps) => theme.spacing(1)}px;
  padding-bottom: ${({ theme }: ThemedProps) => theme.spacing(1)}px;
  margin-bottom: ${({ theme }: ThemedProps) => theme.spacing(2)}px;
  min-height: 48px;
  justify-content: center;
`;

export const DateText = styled.Text`
  color: #064d4c;
  font-family: ${({ theme }: ThemedProps) => theme.typography.body};
`;

export const FooterBar = styled.View`
  background-color: transparent;
  padding: ${({ theme }: ThemedProps) => theme.spacing(2)}px;
  border-top-width: 0px;
`;

export const SubmitButton = styled.TouchableOpacity`
  background-color: #0f3d3a;
  border-radius: 16px;
  align-items: center;
  justify-content: center;
  height: 54px;
  width: 100%;
  margin-top: ${({ theme }: ThemedProps) => theme.spacing(1)}px;
  elevation: 3;
  shadow-color: #0f3d3a;
  shadow-opacity: 0.2;
  shadow-radius: 16px;
  shadow-offset: 0px 8px;
`;

export const SubmitLabel = styled.Text`
  color: #ffffff;
  font-size: 16px;
  font-family: ${({ theme }: ThemedProps) => theme.typography.bodyBold};
  letter-spacing: 0.2px;
`;

export const Row = styled.View`
  flex-direction: row;
  width: 100%;
  gap: ${({ theme }: ThemedProps) => theme.spacing(1)}px;
`;

export const HalfInput = styled(Input)`
  flex: 1;
`;

export const RowButtons = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const StatusBox = styled.View`
  padding: ${({ theme }: ThemedProps) => theme.spacing(1)}px;
  border-radius: ${({ theme }: ThemedProps) => theme.radius.sm}px;
  background-color: #f5fbf7;
  gap: ${({ theme }: ThemedProps) => theme.spacing(0.5)}px;
  margin-bottom: ${({ theme }: ThemedProps) => theme.spacing(1)}px;
`;

export const CameraCard = styled.TouchableOpacity<{ disabled?: boolean }>`
  border-width: 2px;
  border-color: rgba(2, 126, 104, 0.28);
  border-radius: 28px;
  padding: ${({ theme }: ThemedProps) => theme.spacing(3)}px;
  align-items: center;
  justify-content: center;
  height: 220px;
  background-color: #f6fbf9;
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
`;

export const CameraCardText = styled(Body)`
  margin-top: ${({ theme }: ThemedProps) => theme.spacing(1)}px;
  font-size: 18px;
  color: #0b2f2d;
  font-family: ${({ theme }: ThemedProps) => theme.typography.bodyBold};
`;

export const CameraCardSubText = styled(Body)`
  margin-top: ${({ theme }: ThemedProps) => theme.spacing(0.5)}px;
  color: rgba(6, 77, 76, 0.7);
  font-size: 14px;
`;

export const CardsContainer = styled.View`
  width: 100%;
  align-self: center;
`;

export const HeroContinuationCard = styled(Card)`
  width: 100%;
  padding: ${({ theme }: ThemedProps) => theme.spacing(2)}px;
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-left-radius: ${({ theme }: ThemedProps) => theme.radius.lg}px;
  border-bottom-right-radius: ${({ theme }: ThemedProps) => theme.radius.lg}px;
  background-color: #ffffff;
  border-width: 0px;
  elevation: 2;
  shadow-color: #000;
  shadow-opacity: 0.06;
  shadow-radius: 14px;
  shadow-offset: 0px 8px;
  margin-top: ${({ theme }: ThemedProps) => theme.spacing(-3)}px;
  margin-bottom: ${({ theme }: ThemedProps) => theme.spacing(2)}px;
  gap: ${({ theme }: ThemedProps) => theme.spacing(1)}px;
`;

export const FieldCard = styled(Card)`
  width: 100%;
  padding: ${({ theme }: ThemedProps) => theme.spacing(2)}px;
  border-radius: ${({ theme }: ThemedProps) => theme.radius.lg}px;
  background-color: #ffffff;
  border-width: 0px;
  margin-bottom: ${({ theme }: ThemedProps) => theme.spacing(2)}px;
  gap: ${({ theme }: ThemedProps) => theme.spacing(1)}px;
`;

export const FieldCardAccent = styled.View`
  height: 3px;
  width: 48px;
  background-color: #0f5660;
  border-radius: 3px;
  margin-bottom: ${({ theme }: ThemedProps) => theme.spacing(1)}px;
`;

export const FieldCardBody = styled.View`
  width: 100%;
  margin-top: ${({ theme }: ThemedProps) => theme.spacing(1)}px;
`;

export const FieldCardHeader = styled.View`
  margin-bottom: ${({ theme }: ThemedProps) => theme.spacing(1)}px;
`;

export const FieldCardTitle = styled(Title)`
  font-size: 17px;
  color: #064d4c;
`;

export const FieldCardSubtitle = styled(Body)`
  font-size: 13px;
  color: #4e6a64;
`;

export const ReadOnlyRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom-width: 1px;
  border-bottom-color: #f0f4f1;
  padding: ${({ theme }: ThemedProps) => theme.spacing(1)}px 0;
`;

export const ReadOnlyLabel = styled(Body)`
  font-size: 13px;
  color: #647a73;
`;

export const ReadOnlyValue = styled(Body)`
  font-size: 14px;
  color: #0c4d45;
  flex: 1;
  text-align: right;
`;

export const AdminCheckboxContainer = styled.View`
  margin-top: ${({ theme }: ThemedProps) => theme.spacing(1.5)}px;
  padding: ${({ theme }: ThemedProps) => theme.spacing(1.5)}px;
  border-radius: ${({ theme }: ThemedProps) => theme.radius.md}px;
  background-color: #f1f8f6;
  border-width: 1px;
  border-color: #DCEDE7;
`;

export default {};
