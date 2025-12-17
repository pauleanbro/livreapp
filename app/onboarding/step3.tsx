import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView } from "react-native";

import {
    ButtonText,
    Checkbox,
    ErrorBanner,
    ErrorText,
    GhostButton,
    GhostText,
    InfoBanner,
    Input,
    PrimaryButton,
    SecondaryButton,
    Spacer,
    ToggleRow,
} from "@/components/ui/controls";
import { digitOnly } from "@/shared/onboarding/utils";

import { EServices, useServices } from "@/hooks/useServices";
import {
    CompanyVerificationPayload,
    CompanyVerificationResponse,
} from "@/services/onboarding.service";
import { useOnboardingStore } from "@/stores/onboardingStore";
import { Body, Card, Content, Screen, ThemedProps, Title } from "@/components/ui/shared";
import { styled } from "styled-components/native";

type FormValues = CompanyVerificationPayload;

export default function OnboardingStep3() {
  const router = useRouter();
  const onboardingService = useServices(EServices.OnboardingService);
  const store = useOnboardingStore();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (!store.emailVerified) {
      router.replace("/onboarding/step2");
    }
  }, [store.emailVerified, router]);

  const { control, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: {
      cnpj: store.cnpj,
      cpf: store.cpf,
      nome_socio: store.fullName,
    },
  });

  const onVerify = async (data: FormValues) => {
    setError(null);
    setStatusMessage(null);
    try {
      setLoading(true);
      const response: CompanyVerificationResponse = await onboardingService.verifyCompany({
        cnpj: digitOnly(data.cnpj),
        cpf: digitOnly(data.cpf),
        nome_socio: data.nome_socio.trim(),
      });
      store.update({
        cnpj: digitOnly(data.cnpj),
        cpf: digitOnly(data.cpf),
        fullName: data.nome_socio.trim(),
      });
      store.setCompanyData({ ...response, verified: true });
      setStatusMessage("CNPJ verificado com sucesso.");
    } catch {
      setError("Falha ao verificar empresa. Confira os dados.");
    } finally {
      setLoading(false);
    }
  };

  const onNext = () => {
    setError(null);
    if (!store.companyVerified) {
      setError("Verifique o CNPJ antes de avançar.");
      return;
    }
    if (!store.isAdmin) {
      setError("Confirme que você é administrador da empresa.");
      return;
    }
    router.push("/onboarding/step4");
  };

  return (
    <Screen>
      <Content>
        <ScrollView contentContainerStyle={{ paddingBottom: 24, gap: 12 }}>
          <Header>
            <Title>Dados da empresa</Title>
            <Body>Etapa 3 de 6</Body>
          </Header>
          {statusMessage ? <InfoBanner>{statusMessage}</InfoBanner> : null}
          {error ? <ErrorBanner>{error}</ErrorBanner> : null}
          <Card>
            <Controller
              control={control}
              name="cnpj"
              rules={{
                required: "Informe o CNPJ",
                validate: (v) => digitOnly(v).length === 14 || "CNPJ deve ter 14 dígitos",
              }}
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="CNPJ"
                  keyboardType="numeric"
                  value={value}
                  onChangeText={(text) => onChange(digitOnly(text))}
                  maxLength={14}
                />
              )}
            />
            {formState.errors.cnpj ? <ErrorText>{formState.errors.cnpj.message}</ErrorText> : null}

            <Controller
              control={control}
              name="cpf"
              rules={{
                required: "Informe o CPF",
                validate: (v) => digitOnly(v).length === 11 || "CPF deve ter 11 dígitos",
              }}
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="CPF"
                  keyboardType="numeric"
                  value={value}
                  onChangeText={(text) => onChange(digitOnly(text))}
                  maxLength={11}
                />
              )}
            />
            {formState.errors.cpf ? <ErrorText>{formState.errors.cpf.message}</ErrorText> : null}

            <Controller
              control={control}
              name="nome_socio"
              rules={{ required: "Informe o nome completo" }}
              render={({ field: { onChange, value } }) => (
                <Input placeholder="Nome do sócio (seu nome completo)" value={value} onChangeText={onChange} />
              )}
            />
            {formState.errors.nome_socio ? <ErrorText>{formState.errors.nome_socio.message}</ErrorText> : null}

            <SecondaryButton disabled={loading} onPress={handleSubmit(onVerify)}>
              <ButtonText>{loading ? "Verificando..." : "Verificar CNPJ"}</ButtonText>
            </SecondaryButton>

            <Spacer />
            <Input placeholder="Razão social" value={store.corporateName} editable={false} />
            <Input placeholder="CEP" value={store.cep} editable={false} />
            <Input placeholder="Endereço" value={store.address} editable={false} />
            <Row>
              <HalfInput placeholder="Cidade" value={store.city} editable={false} />
              <HalfInput placeholder="UF" value={store.state} editable={false} />
            </Row>
            <Spacer />
            <ToggleRow onPress={() => store.update({ isAdmin: !store.isAdmin })}>
              <Checkbox>{store.isAdmin ? "☑" : "☐"}</Checkbox>
              <Body>Sou administrador da empresa</Body>
            </ToggleRow>
            <Spacer />
            <RowButtons>
              <GhostButton onPress={() => router.replace("/onboarding/step2")}>
                <GhostText>Voltar</GhostText>
              </GhostButton>
              <PrimaryButton style={{ flex: 1 }} disabled={loading} onPress={onNext}>
                <ButtonText>Próximo</ButtonText>
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

const Row = styled.View`
  flex-direction: row;
  gap: ${({ theme }: ThemedProps) => theme.spacing(1)}px;
`;

const HalfInput = styled(Input)`
  flex: 1;
`;

const RowButtons = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }: ThemedProps) => theme.spacing(1)}px;
`;
