import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Platform, ScrollView } from "react-native";

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
import {
    digitOnly,
    formatBirthdate,
    formatCPF,
    formatDateFromDate,
    formatPhone,
    isValidDate,
} from "@/shared/onboarding/utils";

import { EServices, useServices } from "@/hooks/useServices";
import { PersonalData } from "@/services/onboarding.service";
import { useOnboardingStore } from "@/stores/onboardingStore";
import { Body, Card, Content, Screen, ThemedProps, Title } from "@/components/ui/shared";
import { styled } from "styled-components/native";

type FormValues = PersonalData;

export default function OnboardingStep1() {
  const router = useRouter();
  const onboardingService = useServices(EServices.OnboardingService);
  const store = useOnboardingStore();
  const [statusMessage, setStatusMessage] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [showDatePicker, setShowDatePicker] = React.useState(false);

  const { control, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: {
      fullName: store.fullName,
      cpf: digitOnly(store.cpf),
      email: store.email,
      phone: digitOnly(store.phone),
      birthdate: digitOnly(store.birthdate),
      mothersName: store.mothersName,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setError(null);
    setStatusMessage(null);
    store.setPersonalData({
      fullName: data.fullName.trim(),
      cpf: digitOnly(data.cpf),
      email: data.email.trim(),
      phone: digitOnly(data.phone),
      birthdate: formatBirthdate(data.birthdate),
      mothersName: data.mothersName.trim(),
    });

    if (store.emailVerified) {
      router.push("/onboarding/step3");
      return;
    }

    try {
      setLoading(true);
      await onboardingService.sendEmailToken({ email: data.email.trim() });
      setStatusMessage("Código enviado para seu email.");
      router.push("/onboarding/step2");
    } catch {
      setError("Não foi possível enviar o código. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <Content>
        <ScrollView contentContainerStyle={{ paddingBottom: 24, gap: 12 }}>
          <Header>
            <Title>Dados pessoais</Title>
            <Body>Etapa 1 de 6</Body>
          </Header>
          {statusMessage ? <InfoBanner>{statusMessage}</InfoBanner> : null}
          {error ? <ErrorBanner>{error}</ErrorBanner> : null}

          <Card>
            <Controller
              control={control}
              name="fullName"
              rules={{ required: "Informe o nome completo", minLength: { value: 3, message: "Mínimo 3 caracteres" } }}
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Nome completo"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {formState.errors.fullName ? <ErrorText>{formState.errors.fullName.message}</ErrorText> : null}

            <Controller
              control={control}
              name="cpf"
              rules={{
                required: "Informe o CPF",
                validate: (val) => digitOnly(val).length === 11 || "CPF deve ter 11 dígitos",
              }}
              render={({ field: { onChange, value } }) => {
                const masked = formatCPF(value || "");
                return (
                  <Input
                    placeholder="CPF (apenas números)"
                    keyboardType="numeric"
                    inputMode="numeric"
                    value={masked}
                    onChangeText={(text) => onChange(digitOnly(text))}
                    maxLength={14}
                  />
                );
              }}
            />
            {formState.errors.cpf ? <ErrorText>{formState.errors.cpf.message}</ErrorText> : null}

            <Controller
              control={control}
              name="email"
              rules={{
                required: "Informe o email",
                pattern: { value: /\S+@\S+\.\S+/, message: "Email inválido" },
              }}
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Email"
                  keyboardType="email-address"
                  value={value}
                  onChangeText={onChange}
                  autoCapitalize="none"
                />
              )}
            />
            {formState.errors.email ? <ErrorText>{formState.errors.email.message}</ErrorText> : null}

            <Controller
              control={control}
              name="phone"
              rules={{
                required: "Informe o telefone",
                validate: (val) =>
                  (digitOnly(val).length >= 10 && digitOnly(val).length <= 11) ||
                  "Telefone deve ter 10-11 dígitos",
              }}
              render={({ field: { onChange, value } }) => {
                const masked = formatPhone(value || "");
                return (
                  <Input
                    placeholder="Telefone (DDD + número)"
                    keyboardType="phone-pad"
                    inputMode="tel"
                    value={masked}
                    onChangeText={(text) => onChange(digitOnly(text))}
                    maxLength={15}
                  />
                );
              }}
            />
            {formState.errors.phone ? <ErrorText>{formState.errors.phone.message}</ErrorText> : null}

            <Controller
              control={control}
              name="birthdate"
              rules={{
                required: "Informe a data de nascimento",
                validate: (val) =>
                  (() => {
                    const masked = formatBirthdate(val || "");
                    return (
                      (masked.length === 10 && isValidDate(masked)) ||
                      "Data inválida (DD/MM/AAAA)"
                    );
                  })(),
              }}
              render={({ field: { onChange, value } }) => {
                const masked = formatBirthdate(value || "");
                const parsedDate = (() => {
                  const parts = masked.split("/");
                  if (parts.length === 3) {
                    const [d, m, y] = parts.map((p) => Number(p));
                    if (!Number.isNaN(d) && !Number.isNaN(m) && !Number.isNaN(y)) {
                      const date = new Date(y, m - 1, d);
                      if (date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d) {
                        return date;
                      }
                    }
                  }
                  return new Date(1990, 0, 1);
                })();
                return (
                  <>
                    <DateField onPress={() => setShowDatePicker(true)}>
                      <DateText>
                        {masked || "Data de nascimento (DD/MM/AAAA)"}
                      </DateText>
                    </DateField>
                    {showDatePicker ? (
                      <DateTimePicker
                        mode="date"
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        value={parsedDate}
                        maximumDate={new Date()}
                        onChange={(event, selectedDate) => {
                          if (Platform.OS === "android") {
                            setShowDatePicker(false);
                          }
                          if (event.type === "dismissed") return;
                          const picked = selectedDate ?? parsedDate;
                          const formatted = formatDateFromDate(picked);
                          onChange(formatted);
                        }}
                      />
                    ) : null}
                  </>
                );
              }}
            />
            {formState.errors.birthdate ? <ErrorText>{formState.errors.birthdate.message}</ErrorText> : null}

            <Controller
              control={control}
              name="mothersName"
              rules={{ required: "Informe o nome da mãe" }}
              render={({ field: { onChange, value } }) => (
                <Input placeholder="Nome da mãe" value={value} onChangeText={onChange} />
              )}
            />
            {formState.errors.mothersName ? <ErrorText>{formState.errors.mothersName.message}</ErrorText> : null}

            <Spacer />
            <Row>
              <GhostButton onPress={() => router.replace("/auth")}>
                <GhostText>Voltar</GhostText>
              </GhostButton>
              <PrimaryButton style={{ flex: 1 }} disabled={loading} onPress={handleSubmit(onSubmit)}>
                <ButtonText>{loading ? "Enviando..." : "Próximo"}</ButtonText>
              </PrimaryButton>
            </Row>
          </Card>
        </ScrollView>
      </Content>
    </Screen>
  );
}

const Header = styled.View`
  gap: ${({ theme }: ThemedProps) => theme.spacing(0.5)}px;
`;

const DateField = styled.TouchableOpacity`
  border-width: 1px;
  border-color: ${({ theme }: ThemedProps) => theme.colors.border};
  background-color: #ffffff;
  padding: ${({ theme }: ThemedProps) => theme.spacing(1)}px;
  border-radius: ${({ theme }: ThemedProps) => theme.radius.sm}px;
  margin-bottom: ${({ theme }: ThemedProps) => theme.spacing(1)}px;
`;

const DateText = styled.Text`
  color: ${({ theme }: ThemedProps) => theme.colors.text};
  font-family: ${({ theme }: ThemedProps) => theme.typography.body};
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }: ThemedProps) => theme.spacing(1)}px;
`;
