import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, View } from "react-native";

import { Checkbox, InfoBanner, Spacer } from "@/components/ui/controls";
import { EServices, useServices } from "@/hooks/useServices";
import { FinalizeOnboardingPayload } from "@/services/onboarding.service";
import { useOnboardingStore } from "@/stores/onboardingStore";
import { Body, Screen } from "@/components/ui/shared";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import Snackbar from "react-native-snackbar";
import {
  CardsContainer,
  CtaButton,
  CtaLabel,
  FieldCard,
  FieldCardHeader,
  FieldCardSubtitle,
  FieldCardTitle,
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

export default function OnboardingStep5() {
  const router = useRouter();
  const onboardingService = useServices(EServices.OnboardingService);
  const store = useOnboardingStore();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const firstName = store.fullName?.split(/\s+/)[0] || "usuário";
  const loadingProgress = useRef(new Animated.Value(0)).current;
  const loadingLoop = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (!loading) {
      loadingLoop.current?.stop();
      loadingProgress.stopAnimation();
      loadingProgress.setValue(0);
      return;
    }

    loadingLoop.current = Animated.loop(
      Animated.timing(loadingProgress, {
        toValue: 1,
        duration: 1400,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }),
      { resetBeforeIteration: true },
    );
    loadingLoop.current.start();

    return () => {
      loadingLoop.current?.stop();
    };
  }, [loading, loadingProgress]);

  React.useEffect(() => {
    if (!store.identityVerified) {
      router.replace("/onboarding/step4");
    }
  }, [store.identityVerified, router]);

  const handleFinalize = async () => {
    setStatusMessage(null);
    setStatusMessage(null);
    if (!store.acceptTerms || !store.notPep) {
      Snackbar.show({
        text: "Confirme os termos e a declaração PEP para finalizar.",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "#9b1c1c",
      });
      return;
    }
    if (!store.identityVerified) {
      Snackbar.show({
        text: "Biometria ainda não confirmada.",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "#9b1c1c",
      });
      return;
    }

    const devDefaults = {
      phone: "11988887777",
      corporateName: "Livre Digital",
      cep: "01001000",
      address: "Praca da Se",
      city: "Sao Paulo",
      state: "SP",
    };
    const resolvedCompany = {
      phone: store.phone || devDefaults.phone,
      corporateName: store.corporateName || devDefaults.corporateName,
      cep: store.cep || devDefaults.cep,
      address: store.address || devDefaults.address,
      city: store.city || devDefaults.city,
      state: store.state || devDefaults.state,
    };
    if (__DEV__) {
      store.update(resolvedCompany);
    }

    const payload: FinalizeOnboardingPayload = {
      fullName: store.fullName,
      cpf: store.cpf,
      email: store.email,
      phone: resolvedCompany.phone,
      cnpj: store.cnpj,
      corporateName: resolvedCompany.corporateName,
      cep: resolvedCompany.cep,
      address: resolvedCompany.address,
      city: resolvedCompany.city,
      state: resolvedCompany.state,
      birthdate: store.birthdate.replace(/^(\d{2})\/(\d{2})\/(\d{4})$/, "$3-$2-$1"),
      mothersName: store.mothersName,
      identityVerified: store.transactionId || store.identityVerified || "mock-verified",
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
      Snackbar.show({
        text: "Não foi possível finalizar o cadastro.",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "#9b1c1c",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen style={{ backgroundColor: "#F7FAF8" }}>
      <StatusBar style="dark" />
      <MainContent>
        <ScrollArea>
          <ContentPadding>
            <OnboardingHeader>
              <OnboardingTopRow>
                <HeroBackButton onPress={() => router.replace("/onboarding/step4")}>
                  <Ionicons name="arrow-back" size={20} color="#0b2f2d" />
                </HeroBackButton>
              </OnboardingTopRow>
              <HeaderDivider />
            </OnboardingHeader>
            {statusMessage ? <InfoBanner>{statusMessage}</InfoBanner> : null}
            <QuestionBlock>
              <QuestionRow>
                <QuestionLead>{`${firstName}, estamos`}</QuestionLead>
                <QuestionHighlight>quase lá</QuestionHighlight>
              </QuestionRow>
              <QuestionSubtitle style={{ marginBottom: 12 }}>
                Confirme as permissões e afirmações abaixo para finalizar o cadastro.
              </QuestionSubtitle>
            </QuestionBlock>
            <CardsContainer>
              <FieldCard>
                <FieldCardHeader>
                  <FieldCardTitle>Comunicação</FieldCardTitle>
                  <FieldCardSubtitle>Escolha o que deseja receber da gente.</FieldCardSubtitle>
                </FieldCardHeader>
                <Checkbox
                  label="Autorizo o recebimento de duplicatas"
                  value={store.consentReceivables}
                  onValueChange={(value) => store.update({ consentReceivables: value })}
                  labelStyle={{ color: "#064D4C", lineHeight: 22, marginLeft: 6 }}
                />
                <Checkbox
                  label="Quero receber novidades da Livre"
                  value={store.receiveUpdates}
                  onValueChange={(value) => store.update({ receiveUpdates: value })}
                  labelStyle={{ color: "#064D4C", lineHeight: 22, marginLeft: 6 }}
                />
              </FieldCard>

              <FieldCard>
                <FieldCardHeader>
                  <FieldCardTitle>Termos legais</FieldCardTitle>
                  <FieldCardSubtitle>É rápido e ajuda a proteger seus dados.</FieldCardSubtitle>
                </FieldCardHeader>
                <Checkbox
                  label="Aceito os Termos de Uso"
                  value={store.acceptTerms}
                  onValueChange={(value) => store.update({ acceptTerms: value })}
                  labelStyle={{ color: "#064D4C", lineHeight: 22, marginLeft: 6 }}
                />
                <Checkbox
                  label="Não sou PEP (Pessoa Politicamente Exposta)"
                  value={store.notPep}
                  onValueChange={(value) => store.update({ notPep: value })}
                  labelStyle={{ color: "#064D4C", lineHeight: 22, marginLeft: 6 }}
                />
                <Spacer />
              </FieldCard>
            </CardsContainer>
          </ContentPadding>
        </ScrollArea>
      </MainContent>

      <FooterBar>
        <CtaButton disabled={loading} onPress={handleFinalize}>
          {loading ? (
            <Animated.View
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: loadingProgress.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0%", "100%"],
                }),
                backgroundColor: "rgba(255, 255, 255, 0.18)",
              }}
            />
          ) : null}
          <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", zIndex: 1 }}>
            <CtaLabel>{loading ? "enviando..." : "finalizar cadastro"}</CtaLabel>
            <Ionicons name="arrow-forward" size={18} color="#ffffff" />
          </View>
        </CtaButton>
      </FooterBar>
    </Screen>
  );
}
