import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView } from "react-native";

import {
    ButtonText,
    ErrorBanner,
    ErrorText,
    GhostButton,
    GhostText,
    InfoBanner,
    Input,
    PrimaryButton,
    Spacer,
} from "@/components/ui/controls";
import { digitOnly } from "./shared/utils";

import { EServices, useServices } from "@/hooks/useServices";
import { useOnboardingStore } from "@/stores/onboardingStore";
import { Body, Card, Content, Screen, ThemedProps, Title } from "@/styles/shared";
import styled from "styled-components/native";

type FormValues = { emailOtp: string };

export default function OnboardingStep2() {
  const router = useRouter();
  const onboardingService = useServices(EServices.OnboardingService);
  const store = useOnboardingStore();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(0);

  const { control, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: { emailOtp: store.emailOtp },
  });

  useEffect(() => {
    if (!store.email) {
      router.replace("/onboarding");
    }
  }, [store.email, router]);

  useEffect(() => {
    if (resendSeconds <= 0) return;
    const t = setTimeout(() => setResendSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendSeconds]);

  const onSubmit = async (data: FormValues) => {
    setError(null);
    setStatusMessage(null);
    if (!store.email) {
      setError("Preencha o email na etapa anterior.");
      router.replace("/onboarding");
      return;
    }

    try {
      setLoading(true);
      await onboardingService.validateEmailToken({
        email: store.email,
        token: data.emailOtp,
      });
      store.update({ emailOtp: data.emailOtp, emailVerified: true });
      setStatusMessage("Email verificado com sucesso.");
      router.push("/onboarding/step3");
    } catch {
      setError("Código inválido ou expirado.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendSeconds > 0) return;
    setError(null);
    setStatusMessage(null);
    try {
      setLoading(true);
      await onboardingService.sendEmailToken({ email: store.email });
      setResendSeconds(60);
      setStatusMessage("Novo código enviado.");
    } catch {
      setError("Não foi possível reenviar o código.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <Content>
        <ScrollView contentContainerStyle={{ paddingBottom: 24, gap: 12 }}>
          <Header>
            <Title>Confirmação de email</Title>
            <Body>Etapa 2 de 6</Body>
          </Header>
          {statusMessage ? <InfoBanner>{statusMessage}</InfoBanner> : null}
          {error ? <ErrorBanner>{error}</ErrorBanner> : null}
          <Card>
            <Body>Enviamos um código para {store.email || "seu email"}.</Body>
            <Spacer />
            <Controller
              control={control}
              name="emailOtp"
              rules={{
                required: "Informe o código",
                validate: (v) => /^\d{6}$/.test(v) || "Código deve ter 6 dígitos",
              }}
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Código de 6 dígitos"
                  keyboardType="numeric"
                  value={value}
                  onChangeText={(text) => onChange(digitOnly(text))}
                  maxLength={6}
                />
              )}
            />
            {formState.errors.emailOtp ? <ErrorText>{formState.errors.emailOtp.message}</ErrorText> : null}

            <Row>
              <GhostButton onPress={() => router.replace("/onboarding")}>
                <GhostText>Voltar</GhostText>
              </GhostButton>
              <PrimaryButton style={{ flex: 1 }} disabled={loading} onPress={handleSubmit(onSubmit)}>
                <ButtonText>{loading ? "Validando..." : "Próximo"}</ButtonText>
              </PrimaryButton>
            </Row>
            <GhostButton disabled={resendSeconds > 0 || loading} onPress={handleResend}>
              <GhostText>
                {resendSeconds > 0 ? `Reenviar em ${resendSeconds}s` : "Reenviar código"}
              </GhostText>
            </GhostButton>
          </Card>
        </ScrollView>
      </Content>
    </Screen>
  );
}

const Header = styled.View`
  gap: ${({ theme }: ThemedProps) => theme.spacing(0.5)}px;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }: ThemedProps) => theme.spacing(1)}px;
`;
