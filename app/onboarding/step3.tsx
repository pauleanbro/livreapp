import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { Checkbox, ErrorText, Input } from "@/components/ui/controls";
import { digitOnly, formatCNPJ, isValidCNPJ } from "@/shared/onboarding/utils";

import { Screen } from "@/components/ui/shared";
import { EServices, useServices } from "@/hooks/useServices";
import {
  CompanyVerificationPayload,
  CompanyVerificationResponse,
} from "@/services/onboarding.service";
import { useOnboardingStore } from "@/stores/onboardingStore";
import { Ionicons } from "@expo/vector-icons";
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
  AdminCheckboxContainer,
  ScrollArea,
  ReadOnlyLabel,
  ReadOnlyRow,
  ReadOnlyValue,
} from "./styles";
import { StatusBar } from "expo-status-bar";
import Snackbar from "react-native-snackbar";

type FormValues = CompanyVerificationPayload;

export default function OnboardingStep3() {
  const router = useRouter();
  const onboardingService = useServices(EServices.OnboardingService);
  const store = useOnboardingStore();
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(false);
  const [lastValidated, setLastValidated] = useState("");

  const { control, formState, watch } = useForm<FormValues>({
    defaultValues: { cnpj: store.cnpj },
  });

  const cnpjValue = watch("cnpj", store.cnpj);
  const inputStyle = {
    backgroundColor: "#F7FBF9",
    borderColor: "#DCEDE7",
    borderWidth: 1,
    borderBottomWidth: 1,
    borderRadius: 16,
    minHeight: 56,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 8,
    fontSize: 18,
    color: "#064d4c",
    textAlignVertical: "center" as const,
  };
  const placeholderTextColor = "rgba(6, 77, 76, 0.5)";
  const rawName = (store.fullName || "").trim();
  const firstName = rawName.split(/\s+/)[0] || "";
  const questionLead = `${firstName || "Usuário"}, qual o`;

  useEffect(() => {
    if (!store.emailVerified) {
      router.replace("/onboarding/step2");
    }
  }, [store.emailVerified, router]);

  useEffect(() => {
    const sanitized = digitOnly(cnpjValue);
    if (!isValidCNPJ(sanitized) || sanitized === lastValidated || loadingRef.current) {
      return;
    }
    let isMounted = true;
    const verifyCompany = async () => {
      loadingRef.current = true;
      setLoading(true);
      try {
        const response: CompanyVerificationResponse =
          await onboardingService.verifyCompany({
            cnpj: sanitized,
            cpf: store.cpf,
            nome_socio: store.fullName,
          });
        if (!isMounted) return;
        setLastValidated(sanitized);
        store.update({ cnpj: sanitized });
        store.setCompanyData({ ...response, verified: true });
        Snackbar.show({
          text: "CNPJ verificado com sucesso.",
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: "#44EAA2",
        });
      } catch {
        if (!isMounted) return;
        Snackbar.show({
          text: "Falha ao verificar empresa. Confira os dados.",
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: "#9b1c1c",
        });
      } finally {
        loadingRef.current = false;
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    void verifyCompany();
    return () => {
      isMounted = false;
    };
  }, [cnpjValue, lastValidated, onboardingService, store]);

  const onNext = () => {
    if (!store.companyVerified) {
      Snackbar.show({
        text: "Verifique o CNPJ antes de avançar.",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "#9b1c1c",
      });
      return;
    }
    if (!store.isAdmin) {
      Snackbar.show({
        text: "Confirme que você é administrador da empresa.",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "#9b1c1c",
      });
      return;
    }
    router.push("/onboarding/step4");
  };

  return (
    <Screen style={{ backgroundColor: "#F7FAF8" }}>
      <StatusBar style="dark" />
      <MainContent>
        <ScrollArea>
          <ContentPadding>
            <OnboardingHeader>
              <OnboardingTopRow>
                <HeroBackButton onPress={() => router.replace("/onboarding/step2")}>
                  <Ionicons name="arrow-back" size={20} color="#0b2f2d" />
                </HeroBackButton>
              </OnboardingTopRow>
              <HeaderDivider />
            </OnboardingHeader>

            <QuestionBlock>
              <QuestionRow>
                <QuestionLead>{questionLead}</QuestionLead>
                <QuestionHighlight>CNPJ</QuestionHighlight>
                <QuestionLead>da sua empresa?</QuestionLead>
              </QuestionRow>
              <QuestionSubtitle>Confirme os dados da empresa.</QuestionSubtitle>
            </QuestionBlock>

            <InputBlock>
              <Controller
                control={control}
                name="cnpj"
                rules={{
                  required: "Informe o CNPJ",
                  validate: (value) => isValidCNPJ(value) || "CNPJ inválido",
                }}
                render={({ field: { onChange, value } }) => (
                  <Input
                    placeholder="Ex: 12.345.678/0001-95"
                    keyboardType="numeric"
                    value={formatCNPJ(value)}
                    onChangeText={(text) => onChange(formatCNPJ(text))}
                    maxLength={18}
                    inputStyle={inputStyle}
                    placeholderTextColor={placeholderTextColor}
                  />
                )}
              />
              {formState.errors.cnpj ? (
                <ErrorText>{formState.errors.cnpj.message}</ErrorText>
              ) : null}
            </InputBlock>

            {store.corporateName || store.cep ? (
              <InputBlock>
                <ReadOnlyRow>
                  <ReadOnlyLabel>Razão social</ReadOnlyLabel>
                  <ReadOnlyValue>{store.corporateName || "-"}</ReadOnlyValue>
                </ReadOnlyRow>
                <ReadOnlyRow>
                  <ReadOnlyLabel>CEP</ReadOnlyLabel>
                  <ReadOnlyValue>{store.cep || "-"}</ReadOnlyValue>
                </ReadOnlyRow>
                <ReadOnlyRow>
                  <ReadOnlyLabel>Endereço</ReadOnlyLabel>
                  <ReadOnlyValue>{store.address || "-"}</ReadOnlyValue>
                </ReadOnlyRow>
                <ReadOnlyRow>
                  <ReadOnlyLabel>Cidade / UF</ReadOnlyLabel>
                  <ReadOnlyValue>
                    {store.city || "-"} / {store.state || "-"}
                  </ReadOnlyValue>
                </ReadOnlyRow>
                <AdminCheckboxContainer>
                  <Checkbox
                    label="Sou administrador da empresa"
                    value={store.isAdmin}
                    onValueChange={(value) => store.update({ isAdmin: value })}
                    labelStyle={{ color: "#064D4C", lineHeight: 22, marginLeft: 8 }}
                    containerStyle={{ alignItems: "center" }}
                  />
                </AdminCheckboxContainer>
              </InputBlock>
            ) : null}
          </ContentPadding>
        </ScrollArea>
      </MainContent>

      <FooterBar>
        <CtaButton disabled={loading} onPress={onNext}>
          <CtaLabel>{loading ? "verificando..." : "próximo"}</CtaLabel>
          <Ionicons name="arrow-forward" size={18} color="#ffffff" />
        </CtaButton>
      </FooterBar>
    </Screen>
  );
}
