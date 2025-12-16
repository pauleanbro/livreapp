import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";

import {
  ButtonText,
  ErrorBanner,
  InfoBanner,
  GhostButton,
  GhostText,
  PrimaryButton,
  SecondaryButton,
  Spacer,
} from "@/components/ui/controls";
import { birthdateToISO, digitOnly } from "./shared/utils";

import { EServices, useServices } from "@/hooks/useServices";
import { BioStatus } from "@/services/onboarding.service";
import { useOnboardingStore } from "@/stores/onboardingStore";
import { Body, Card, Content, Screen, ThemedProps, Title } from "@/styles/shared";
import styled from "styled-components/native";

export default function OnboardingStep4() {
  const router = useRouter();
  const onboardingService = useServices(EServices.OnboardingService);
  const store = useOnboardingStore();

  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [bioLoading, setBioLoading] = useState(false);
  const [bioStatus, setBioStatus] = useState<string | null>(null);

  const createMockBio = async () => {
    if (store.transactionId || loading) return;
    setBioLoading(true);
    setError(null);
    setStatusMessage("Gerando link de biometria (mock)...");
    try {
      const bioLink = await onboardingService.createBioLink({
        document: digitOnly(store.cpf),
        name: store.fullName,
        birthdate: birthdateToISO(store.birthdate),
        email: store.email,
        mothersName: store.mothersName,
        verifiedEmail: true,
      });
      const status = await onboardingService.fetchBioStatus(bioLink.transactionId);
      setBioStatus(status.status);
      store.setIdentity({
        transactionId: bioLink.transactionId,
        identityVerified: status.status === BioStatus.Done ? bioLink.transactionId : undefined,
      });
      if (status.status === BioStatus.Done) {
        setStatusMessage("Biometria confirmada.");
        router.push("/onboarding/step5");
      } else {
        setStatusMessage("Biometria pendente. Clique em 'Já fiz a biometria' para atualizar.");
      }
    } catch {
      setError("Não foi possível iniciar a biometria mock.");
    } finally {
      setBioLoading(false);
    }
  };

  useEffect(() => {
    if (!store.fullName || !store.cpf || !store.email) {
      router.replace("/onboarding");
      return;
    }
    if (!store.companyVerified) {
      router.replace("/onboarding/step3");
      return;
    }
    if (store.identityVerified) {
      setStatusMessage("Biometria já confirmada.");
      return;
    }
    void createMockBio();
  }, [store.companyVerified, store.identityVerified, router]);

  const handleManualCheck = async () => {
    if (!store.transactionId) return;
    setLoading(true);
    setError(null);
    try {
      const status = await onboardingService.fetchBioStatus(store.transactionId);
      setBioStatus(status.status);
      if (status.status === BioStatus.Done) {
        store.setIdentity({
          transactionId: store.transactionId,
          identityVerified: store.transactionId,
        });
        setStatusMessage("Identidade confirmada.");
        router.push("/onboarding/step5");
      } else {
        setStatusMessage("Biometria ainda pendente.");
      }
    } catch {
      setError("Falha ao consultar biometria.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <Content>
        <ScrollView contentContainerStyle={{ paddingBottom: 24, gap: 12 }}>
          <Header>
            <Title>Verificação de identidade</Title>
            <Body>Etapa 4 de 6</Body>
          </Header>
          {statusMessage ? <InfoBanner>{statusMessage}</InfoBanner> : null}
          {error ? <ErrorBanner>{error}</ErrorBanner> : null}
          <Card>
            <StatusBox>
              <Body>
                {store.identityVerified
                  ? "Biometria confirmada."
                  : bioStatus || "Gerando biometria mock..."}
              </Body>
              {store.transactionId ? <Body>Transação: {store.transactionId}</Body> : null}
            </StatusBox>
            <SecondaryButton disabled={!store.transactionId || loading} onPress={handleManualCheck}>
              <ButtonText>{loading ? "Consultando..." : "Já fiz a biometria"}</ButtonText>
            </SecondaryButton>
            <Spacer />
            <RowButtons>
              <GhostButton onPress={() => router.replace("/onboarding/step3")}>
                <GhostText>Voltar</GhostText>
              </GhostButton>
              <PrimaryButton
                style={{ flex: 1 }}
                disabled={!store.identityVerified || bioLoading}
                onPress={() => router.push("/onboarding/step5")}
              >
                <ButtonText>Avançar</ButtonText>
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

const StatusBox = styled.View`
  padding: ${({ theme }: ThemedProps) => theme.spacing(1)}px;
  border-radius: ${({ theme }: ThemedProps) => theme.radius.sm}px;
  background-color: #f5fbf7;
  gap: ${({ theme }: ThemedProps) => theme.spacing(0.5)}px;
  margin-bottom: ${({ theme }: ThemedProps) => theme.spacing(1)}px;
`;

const RowButtons = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }: ThemedProps) => theme.spacing(1)}px;
`;
