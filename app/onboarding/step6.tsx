import { useRouter } from "expo-router";
import React from "react";
import { ScrollView } from "react-native";

import { ButtonText, GhostButton, GhostText, PrimaryButton, Spacer } from "@/components/ui/controls";

import { Body, Card, Content, Screen, ThemedProps, Title } from "@/styles/shared";
import styled from "styled-components/native";

export default function OnboardingStep6() {
  const router = useRouter();

  return (
    <Screen>
      <Content>
        <ScrollView contentContainerStyle={{ paddingBottom: 24, gap: 12 }}>
          <Header>
            <Title>Sucesso!</Title>
            <Body>Etapa 6 de 6</Body>
          </Header>
          <Card>
            <Body>Cadastro enviado. Entraremos em contato com as próximas etapas.</Body>
            <Spacer />
            <RowButtons>
              <GhostButton onPress={() => router.replace("/onboarding/step5")}>
                <GhostText>Voltar</GhostText>
              </GhostButton>
              <PrimaryButton onPress={() => router.replace("/auth")}>
                <ButtonText>Voltar ao login</ButtonText>
              </PrimaryButton>
            </RowButtons>
          </Card>
        </ScrollView>
      </Content>
    </Screen>
  );
}

const Header = styled.View`
  gap: ${({ theme }: ThemedProps) => theme.spacing(0.5)}px;
`;

const RowButtons = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }: ThemedProps) => theme.spacing(1)}px;
`;
