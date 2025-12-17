import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView } from "react-native";

import {
    ButtonText,
    Checkbox,
    ErrorBanner,
    GhostButton,
    GhostText,
    InfoBanner,
    PrimaryButton,
    Spacer,
    ToggleRow,
} from "@/components/ui/controls";

import { EServices, useServices } from "@/hooks/useServices";
import { FinalizeOnboardingPayload } from "@/services/onboarding.service";
import { useOnboardingStore } from "@/stores/onboardingStore";
import { Body, Card, Content, Screen, ThemedProps, Title } from "@/components/ui/shared";
import { styled } from "styled-components/native";

export default function OnboardingStep5() {
  const router = useRouter();
  const onboardingService = useServices(EServices.OnboardingService);
  const store = useOnboardingStore();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (!store.identityVerified) {
      router.replace("/onboarding/step4");
    }
  }, [store.identityVerified, router]);

  const handleFinalize = async () => {
    setError(null);
    setStatusMessage(null);
    if (!store.isAdmin || !store.acceptTerms || !store.notPep) {
      setError("Confirme administrador, termos e declaração PEP para finalizar.");
      return;
    }
    if (!store.identityVerified) {
      setError("Biometria ainda não confirmada.");
      return;
    }

    const payload: FinalizeOnboardingPayload = {
      fullName: store.fullName,
      cpf: store.cpf,
      email: store.email,
      phone: store.phone,
      cnpj: store.cnpj,
      corporateName: store.corporateName,
      cep: store.cep,
      address: store.address,
      city: store.city,
      state: store.state,
      birthdate: store.birthdate,
      mothersName: store.mothersName,
      identityVerified: store.identityVerified || "mock-verified",
      isAdmin: store.isAdmin,
      consentReceivables: store.consentReceivables,
      acceptTerms: store.acceptTerms,
      receiveUpdates: store.receiveUpdates,
      notPep: store.notPep,
      transaction_id: store.transactionId,
    };

    try {
      setLoading(true);
      await onboardingService.finalize(payload);
      setStatusMessage("Cadastro finalizado com sucesso.");
      store.reset();
      router.push("/onboarding/step6");
    } catch {
      setError("Não foi possível finalizar o cadastro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <Content>
        <ScrollView contentContainerStyle={{ paddingBottom: 24, gap: 12 }}>
          <Header>
            <Title>Revisão e termos</Title>
            <Body>Etapa 5 de 6</Body>
          </Header>
          {statusMessage ? <InfoBanner>{statusMessage}</InfoBanner> : null}
          {error ? <ErrorBanner>{error}</ErrorBanner> : null}
          <Card>
            <ToggleRow onPress={() => store.update({ isAdmin: !store.isAdmin })}>
              <Checkbox>{store.isAdmin ? "☑" : "☐"}</Checkbox>
              <Body>Sou administrador da empresa</Body>
            </ToggleRow>
            <ToggleRow
              onPress={() =>
                store.update({ consentReceivables: !store.consentReceivables })
              }
            >
              <Checkbox>{store.consentReceivables ? "☑" : "☐"}</Checkbox>
              <Body>Autorizo o recebimento de duplicatas</Body>
            </ToggleRow>
            <ToggleRow
              onPress={() => store.update({ receiveUpdates: !store.receiveUpdates })}
            >
              <Checkbox>{store.receiveUpdates ? "☑" : "☐"}</Checkbox>
              <Body>Quero receber novidades</Body>
            </ToggleRow>
            <ToggleRow onPress={() => store.update({ acceptTerms: !store.acceptTerms })}>
              <Checkbox>{store.acceptTerms ? "☑" : "☐"}</Checkbox>
              <Body>Aceito os termos</Body>
            </ToggleRow>
            <ToggleRow onPress={() => store.update({ notPep: !store.notPep })}>
              <Checkbox>{store.notPep ? "☑" : "☐"}</Checkbox>
              <Body>Não sou PEP</Body>
            </ToggleRow>
            <Spacer />
            <RowButtons>
              <GhostButton onPress={() => router.replace("/onboarding/step4")}>
                <GhostText>Voltar</GhostText>
              </GhostButton>
              <PrimaryButton style={{ flex: 1 }} disabled={loading} onPress={handleFinalize}>
                <ButtonText>{loading ? "Enviando..." : "Finalizar cadastro"}</ButtonText>
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
