import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import {
  ErrorBanner,
  ErrorText,
  GhostButton,
  GhostText,
  InfoBanner,
} from "@/components/ui/controls";
import { digitOnly } from "@/shared/onboarding/utils";

import { EServices, useServices } from "@/hooks/useServices";
import { useOnboardingStore } from "@/stores/onboardingStore";
import { Screen } from "@/components/ui/shared";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { getStringAsync } from "expo-clipboard";
import {
  CtaButton,
  CtaLabel,
  FooterBar,
  HeroBackButton,
  InputBlock,
  MainContent,
  OnboardingHeader,
  OnboardingTopRow,
  HeaderDivider,
  QuestionBlock,
  QuestionHighlight,
  QuestionLead,
  QuestionRow,
  QuestionSubtitle,
  ContentPadding,
  ScrollArea,
} from "./styles";
import { OTPInput } from "@/components/ui/otp";

type FormValues = { emailOtp: string };
const leafPattern = require("../../assets/images/leaf-pattern.png");

export default function OnboardingStep2() {
  const router = useRouter();
  const onboardingService = useServices(EServices.OnboardingService);
  const store = useOnboardingStore();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(0);

  const { control, handleSubmit, formState, setValue, watch } = useForm<FormValues>({
    defaultValues: { emailOtp: store.emailOtp },
  });
  const otpValue = watch("emailOtp");
  const OTP_LENGTH = 6;

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

  useEffect(() => {
    if (otpValue.length === OTP_LENGTH) return;
    let isMounted = true;
    const tryClipboard = async () => {
      const clipboardText = await getStringAsync();
      if (!isMounted) return;
      const digits = digitOnly(clipboardText).slice(0, OTP_LENGTH);
      if (digits.length === OTP_LENGTH && digits !== otpValue) {
        setValue("emailOtp", digits);
      }
    };
    void tryClipboard();
    return () => {
      isMounted = false;
    };
  }, [OTP_LENGTH, otpValue, setValue]);

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

  const questionLead = `${store.fullName?.split(/\s+/)[0] || "Certo"},`;

  return (
    <Screen style={{ backgroundColor: "#F7FAF8" }}>
      <StatusBar style="dark" />
      <MainContent>
        <ScrollArea>
          <ContentPadding>
            <OnboardingHeader>
              <OnboardingTopRow>
                <HeroBackButton onPress={() => router.replace("/onboarding")}>
                  <Ionicons name="arrow-back" size={20} color="#0b2f2d" />
                </HeroBackButton>
              </OnboardingTopRow>
              <HeaderDivider />
            </OnboardingHeader>
            {statusMessage ? <InfoBanner>{statusMessage}</InfoBanner> : null}
            {error ? <ErrorBanner>{error}</ErrorBanner> : null}
            <QuestionBlock>
              <QuestionRow>
                <QuestionLead>{questionLead}</QuestionLead>
                <QuestionHighlight>confirme o código</QuestionHighlight>
              </QuestionRow>
              <QuestionSubtitle>Enviamos para {store.email || "seu e-mail"}.</QuestionSubtitle>
            </QuestionBlock>
            <InputBlock>
              <Controller
                control={control}
                name="emailOtp"
                rules={{
                  required: "Informe o código",
                  validate: (v) => /^\d{6}$/.test(v) || "Código deve ter 6 dígitos",
                }}
                render={({ field: { onChange, value } }) => (
                  <OTPInput
                    value={value}
                    onChange={(text) => onChange(digitOnly(text))}
                    length={6}
                    containerStyle={{ marginTop: 8 }}
                    cellStyle={{ borderColor: "#DCEDE7" }}
                  />
                )}
              />
              {formState.errors.emailOtp ? <ErrorText>{formState.errors.emailOtp.message}</ErrorText> : null}
              <GhostButton
                disabled={resendSeconds > 0 || loading}
                onPress={handleResend}
                style={{ marginTop: 12 }}
              >
                <GhostText>
                  {resendSeconds > 0 ? `Reenviar em ${resendSeconds}s` : "Reenviar código"}
                </GhostText>
              </GhostButton>
            </InputBlock>
          </ContentPadding>
        </ScrollArea>
      </MainContent>

      <FooterBar>
        <CtaButton disabled={loading} onPress={handleSubmit(onSubmit)}>
          <CtaLabel>{loading ? "validando..." : "próximo"}</CtaLabel>
          <Ionicons name="arrow-forward" size={18} color="#ffffff" />
        </CtaButton>
      </FooterBar>
    </Screen>
  );
}
