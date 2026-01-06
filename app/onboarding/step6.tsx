import { useRouter } from "expo-router";
import React from "react";

import { GhostButton, GhostText } from "@/components/ui/controls";
import { Body, Screen } from "@/components/ui/shared";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import {
  CtaButton,
  CtaLabel,
  FieldCard,
  FooterBar,
  HeaderDivider,
  HeroBackButton,
  MainContent,
  OnboardingHeader,
  OnboardingTopRow,
  QuestionBlock,
  QuestionHighlight,
  QuestionLead,
  QuestionRow,
  QuestionSubtitle,
  ContentPadding,
  ScrollArea,
} from "./styles";

export default function OnboardingStep6() {
  const router = useRouter();

  return (
    <Screen style={{ backgroundColor: "#F7FAF8" }}>
      <StatusBar style="dark" />
      <MainContent>
        <ScrollArea>
          <ContentPadding>
            <OnboardingHeader>
              <OnboardingTopRow>
                <HeroBackButton onPress={() => router.replace("/onboarding/step5")}>
                  <Ionicons name="arrow-back" size={20} color="#0b2f2d" />
                </HeroBackButton>
              </OnboardingTopRow>
              <HeaderDivider />
            </OnboardingHeader>

            <QuestionBlock>
              <QuestionRow>
                <QuestionLead>Pronto,</QuestionLead>
                <QuestionHighlight>cadastro enviado</QuestionHighlight>
              </QuestionRow>
              <QuestionSubtitle>
                Entraremos em contato com os próximos passos assim que sua análise for concluída.
              </QuestionSubtitle>
            </QuestionBlock>

            <FieldCard>
              <Body>Se quiser revisar algum detalhe, você pode voltar uma etapa antes de sair.</Body>
              <GhostButton onPress={() => router.replace("/onboarding/step5")}>
                <GhostText>Voltar e revisar</GhostText>
              </GhostButton>
            </FieldCard>
          </ContentPadding>
        </ScrollArea>
      </MainContent>

      <FooterBar>
        <CtaButton onPress={() => router.replace("/auth")}>
          <CtaLabel>voltar ao login</CtaLabel>
          <Ionicons name="arrow-forward" size={18} color="#ffffff" />
        </CtaButton>
      </FooterBar>
    </Screen>
  );
}
