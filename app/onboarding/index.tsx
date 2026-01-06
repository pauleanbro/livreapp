import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Platform } from "react-native";

import { ErrorText, GhostButton, GhostText, InfoBanner, Input } from "@/components/ui/controls";
import {
  digitOnly,
  formatBirthdate,
  formatCPF,
  formatDateFromDate,
  formatPhone,
  isValidDate,
} from "@/shared/onboarding/utils";

import { Screen } from "@/components/ui/shared";
import { EServices, useServices } from "@/hooks/useServices";
import { PersonalData } from "@/services/onboarding.service";
import { useOnboardingStore } from "@/stores/onboardingStore";
import { Ionicons } from "@expo/vector-icons";
import {
  CtaButton,
  CtaLabel,
  DateField,
  DateText,
  FooterBar,
  HeroBackButton,
  InputBlock,
  MainContent,
  OnboardingHeader,
  OnboardingTopRow,
  ProgressFill,
  ProgressTrack,
  QuestionBlock,
  QuestionHighlight,
  QuestionLead,
  QuestionRow,
  QuestionSubtitle,
  StepText,
  ContentPadding,
  ScrollArea,
} from "./styles";
import { StatusBar } from "expo-status-bar";
import Snackbar from "react-native-snackbar";

type FormValues = PersonalData;

export default function OnboardingStep1() {
  const router = useRouter();
  const onboardingService = useServices(EServices.OnboardingService);
  const store = useOnboardingStore();
  const [statusMessage, setStatusMessage] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [moduleIndex, setModuleIndex] = React.useState(0);

  const { control, handleSubmit, formState, trigger, getValues, setValue } = useForm<FormValues>({
    defaultValues: {
      fullName: store.fullName,
      cpf: digitOnly(store.cpf),
      email: store.email,
      phone: digitOnly(store.phone),
      birthdate: digitOnly(store.birthdate),
      mothersName: store.mothersName,
    },
    shouldUnregister: false,
  });

  React.useEffect(() => {
    setValue("fullName", store.fullName);
    setValue("cpf", digitOnly(store.cpf));
    setValue("email", store.email);
    setValue("phone", digitOnly(store.phone));
    setValue("birthdate", digitOnly(store.birthdate));
    setValue("mothersName", store.mothersName);
  }, [
    moduleIndex,
    setValue,
    store.fullName,
    store.cpf,
    store.email,
    store.phone,
    store.birthdate,
    store.mothersName,
  ]);

  const onSubmit = async (data: FormValues) => {
   setStatusMessage(null);
    store.setPersonalData({
      fullName: (data.fullName ?? store.fullName).trim(),
      cpf: digitOnly(data.cpf ?? store.cpf),
      email: (data.email ?? store.email).trim(),
      phone: digitOnly(data.phone ?? store.phone),
      birthdate: formatBirthdate(data.birthdate ?? store.birthdate),
      mothersName: (data.mothersName ?? store.mothersName).trim(),
    });

    if (store.emailVerified) {
      router.push("/onboarding/step3");
      return;
    }

    try {
      setLoading(true);
      const emailToUse = (data.email ?? store.email).trim();
      if (!emailToUse) {
        throw new Error("email inválido");
      }
      await onboardingService.sendEmailToken({ email: emailToUse });
      setStatusMessage("Código enviado para seu email.");
      router.push("/onboarding/step2");
    } catch {
      Snackbar.show({
        text: "Não foi possível enviar o código. Tente novamente.",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "#9b1c1c",
      });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    backgroundColor: "#F7FBF9",
    borderColor: "#DCEDE7",
    borderWidth: 1,
    borderBottomWidth: 1,
    borderRadius: 16,
    minHeight: 56,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 6,
    fontSize: 18,
    color: "#064d4c",
    textAlignVertical: "center" as const,
  };
  const placeholderTextColor = "rgba(6, 77, 76, 0.5)";

  type PersonalField = keyof FormValues;

  const personalModules: { title: string; subtitle: string; field: PersonalField }[] = [
    {
      title: "Nome completo",
      subtitle: "Começamos pelo básico: quem é você?",
      field: "fullName",
    },
    {
      title: "CPF",
      subtitle: "Seu documento principal precisa estar correto.",
      field: "cpf",
    },
    {
      title: "E-mail",
      subtitle: "Para manter contato oficial.",
      field: "email",
    },
    {
      title: "Celular",
      subtitle: "Vamos precisar enviar avisos e confirmações.",
      field: "phone",
    },
    {
      title: "Data de nascimento",
      subtitle: "Ajuda na verificação de identidade.",
      field: "birthdate",
    },
    {
      title: "Nome da mãe",
      subtitle: "Último dado para reforçar a segurança.",
      field: "mothersName",
    },
  ];

  const currentModule = personalModules[moduleIndex];
  const totalSteps = personalModules.length;
  const stepIndex = Math.min(moduleIndex + 1, totalSteps);
  const progressWidth = `${Math.round((stepIndex / totalSteps) * 100)}%`;
  const questionHighlight =
    currentModule?.field === "cpf" ? "CPF" : currentModule?.title.toLowerCase() ?? "";
  const rawName = (store.fullName || getValues("fullName") || "").trim();
  const firstName = rawName.split(/\s+/)[0] || "";
  const questionLead = moduleIndex === 0 ? "Qual o seu" : `${firstName || "Certo"}, qual o seu`;
  const handleDevBypass = () => {
    store.setPersonalData({
      fullName: "Paulo Emílio Godinho da Fonseca",
      cpf: "14876751609",
      phone: "11988887777",
      birthdate: "25/01/1998",
      mothersName: "Jurema Moreira Godinho da Fonseca",
      email: "agata-frizzo@tuamaeaquelaursa.com",
    });
    store.setCompanyData({
      corporateName: "Livre Digital",
      cep: "01001000",
      address: "Praca da Se",
      city: "Sao Paulo",
      state: "SP",
      verified: true,
    });
    store.update({
      cnpj: "59030535000158",
      emailVerified: true,
      companyVerified: true,
      isAdmin: true,
    });
    router.push("/onboarding/step4");
  };
  const isLastModule = moduleIndex === personalModules.length - 1;
  const fieldRenderers: Record<PersonalField, () => React.ReactElement> = {
    fullName: () => (
      <>
        <Controller
          control={control}
          name="fullName"
          rules={{
            required: "Informe o nome completo",
            minLength: { value: 3, message: "Mínimo 3 caracteres" },
          }}
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Ex: Fulano"
              value={value}
              onChangeText={onChange}
              inputStyle={inputStyle}
              placeholderTextColor={placeholderTextColor}
            />
          )}
        />
        {formState.errors.fullName ? <ErrorText>{formState.errors.fullName.message}</ErrorText> : null}
      </>
    ),
    cpf: () => (
      <>
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
                placeholder="Ex: 000.000.000-00"
                keyboardType="numeric"
                inputMode="numeric"
                value={masked}
                onChangeText={(text) => onChange(digitOnly(text))}
                maxLength={14}
                inputStyle={inputStyle}
                placeholderTextColor={placeholderTextColor}
              />
            );
          }}
        />
        {formState.errors.cpf ? <ErrorText>{formState.errors.cpf.message}</ErrorText> : null}
      </>
    ),
    email: () => (
      <>
        <Controller
          control={control}
          name="email"
          rules={{
            required: "Informe o email",
            pattern: { value: /\S+@\S+\.\S+/, message: "Email inválido" },
          }}
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Ex: joao@empresa.com"
              keyboardType="email-address"
              value={value}
              onChangeText={onChange}
              autoCapitalize="none"
              inputStyle={inputStyle}
              placeholderTextColor={placeholderTextColor}
            />
          )}
        />
        {formState.errors.email ? <ErrorText>{formState.errors.email.message}</ErrorText> : null}
      </>
    ),
    phone: () => (
      <>
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
                placeholder="Ex: (11) 99999-9999"
                keyboardType="phone-pad"
                inputMode="tel"
                value={masked}
                onChangeText={(text) => onChange(digitOnly(text))}
                maxLength={15}
                inputStyle={inputStyle}
                placeholderTextColor={placeholderTextColor}
              />
            );
          }}
        />
        {formState.errors.phone ? <ErrorText>{formState.errors.phone.message}</ErrorText> : null}
      </>
    ),
    birthdate: () => (
      <>
        <Controller
          control={control}
          name="birthdate"
          rules={{
            required: "Informe a data de nascimento",
            validate: (val) =>
              (() => {
                const masked = formatBirthdate(val || "");
                return (masked.length === 10 && isValidDate(masked)) || "Data inválida (DD/MM/AAAA)";
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
                  <DateText>{masked || "DD/MM/AAAA"}</DateText>
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
      </>
    ),
    mothersName: () => (
      <>
        <Controller
          control={control}
          name="mothersName"
          rules={{ required: "Informe o nome da mãe" }}
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Ex: Maria da Silva"
              value={value}
              onChangeText={onChange}
              inputStyle={inputStyle}
              placeholderTextColor={placeholderTextColor}
            />
          )}
        />
        {formState.errors.mothersName ? <ErrorText>{formState.errors.mothersName.message}</ErrorText> : null}
      </>
    ),
  };

  const renderModuleField = (fieldName: PersonalField) => fieldRenderers[fieldName]?.() ?? null;

  const persistField = (fieldName: PersonalField) => {
    const values = getValues();
    const persistMap: Record<PersonalField, () => void> = {
      fullName: () => {
        const next = values.fullName.trim();
        store.update({ fullName: next });
        setValue("fullName", next);
      },
      cpf: () => {
        const next = digitOnly(values.cpf);
        store.update({ cpf: next });
        setValue("cpf", next);
      },
      email: () => {
        const next = values.email.trim();
        store.update({ email: next });
        setValue("email", next);
      },
      phone: () => {
        const next = digitOnly(values.phone);
        store.update({ phone: next });
        setValue("phone", next);
      },
      birthdate: () => {
        const next = formatBirthdate(values.birthdate);
        store.update({ birthdate: next });
        setValue("birthdate", next);
      },
      mothersName: () => {
        const next = values.mothersName.trim();
        store.update({ mothersName: next });
        setValue("mothersName", next);
      },
    };
    persistMap[fieldName]();
  };

  const handleModuleContinue = async () => {
    const fieldName = personalModules[moduleIndex].field;
    const valid = await trigger(fieldName);
    if (!valid) return;
    persistField(fieldName);
    if (isLastModule) {
      handleSubmit(onSubmit)();
      return;
    }
    setModuleIndex((prev) => prev + 1);
  };

  const handleModuleBack = () => {
    if (moduleIndex > 0) {
      setModuleIndex((prev) => prev - 1);
      return;
    }
    router.replace("/auth");
  };

  return (
    <Screen style={{ backgroundColor: "#F7FAF8" }}>
      <StatusBar style="dark" />
      <MainContent>
        <ScrollArea>
          <ContentPadding>
            <OnboardingHeader>
              <OnboardingTopRow>
                <HeroBackButton onPress={handleModuleBack}>
                  <Ionicons name="arrow-back" size={20} color="#0b2f2d" />
                </HeroBackButton>
                <StepText>PASSO {stepIndex} DE {totalSteps}</StepText>
              </OnboardingTopRow>
              <ProgressTrack>
                <ProgressFill style={{ width: progressWidth }} />
              </ProgressTrack>
            </OnboardingHeader>

            {statusMessage ? <InfoBanner>{statusMessage}</InfoBanner> : null}

            <QuestionBlock>
              <QuestionRow>
                <QuestionLead>{questionLead}</QuestionLead>
                <QuestionHighlight>{questionHighlight}?</QuestionHighlight>
              </QuestionRow>
              <QuestionSubtitle>{currentModule.subtitle}</QuestionSubtitle>
            </QuestionBlock>

            <InputBlock>{renderModuleField(currentModule.field)}</InputBlock>
            {__DEV__ ? (
              <GhostButton onPress={handleDevBypass} style={{ marginTop: 16 }}>
                <GhostText>Pular para biometria (dev)</GhostText>
              </GhostButton>
            ) : null}
          </ContentPadding>
        </ScrollArea>
      </MainContent>

      <FooterBar>
        <CtaButton disabled={loading} onPress={handleModuleContinue}>
          <CtaLabel>{isLastModule ? (loading ? "Enviando..." : "Próximo") : "continuar"}</CtaLabel>
          <Ionicons name="arrow-forward" size={18} color="#ffffff" />
        </CtaButton>
      </FooterBar>
    </Screen>
  );
}
