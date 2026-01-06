import { useRouter } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Input as TextInputControl } from "@/components/ui/controls";
import { Screen } from "@/components/ui/shared";
import { Ionicons } from "@expo/vector-icons";

import {
  BackButton,
  BackgroundView,
  Bottom,
  ContentView,
  Form,
  FormGroup,
  HeaderDivider,
  HeaderRow,
  Middle,
  NoticeBody,
  NoticeCard,
  NoticeRow,
  NoticeTitle,
  PrimaryCta,
  PrimaryCtaLabel,
  TitleBlock,
  TitleHighlight,
  TitleLead,
  TitleRow,
  TitleSubtitle,
} from "./styles";

type RecoveryFormValues = {
  email: string;
};

export default function Recovery() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { control, handleSubmit } = useForm<RecoveryFormValues>({
    defaultValues: { email: "" },
  });

  const onSubmit = (_data: RecoveryFormValues) => {};

  const inputStyle = {
    borderColor: "#DCEDE7",
    backgroundColor: "#F7FBF9",
    color: "#0b2f2d",
    minHeight: 56,
    paddingVertical: 12,
    borderRadius: 12,
  } as const;

  const labelStyle = {
    color: "#0b2f2d",
  } as const;

  return (
    <Screen>
      <BackgroundView>
        <KeyboardAvoidingView
          style={{ flex: 1, width: "100%" }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <ContentView style={{ paddingBottom: insets.bottom }}>
              <Middle>
                <TitleBlock>
                  <HeaderRow>
                    <BackButton onPress={() => router.back()}>
                      <Ionicons name="arrow-back" size={20} color="#0b2f2d" />
                    </BackButton>
                  </HeaderRow>
                  <TitleRow>
                    <TitleLead>Recuperar </TitleLead>
                    <TitleHighlight>acesso</TitleHighlight>
                  </TitleRow>
                  <TitleSubtitle>Informe seu e-mail de cadastro para continuar.</TitleSubtitle>
                </TitleBlock>
                <HeaderDivider />
                <Form>
                  <FormGroup>
                    <Controller
                      control={control}
                      name="email"
                      render={({ field: { onChange, value } }) => (
                        <TextInputControl
                          label="E-mail"
                          labelStyle={labelStyle}
                          value={value}
                          onChangeText={onChange}
                          inputStyle={inputStyle}
                          placeholder="seu@email.com"
                          placeholderTextColor="rgba(11, 47, 45, 0.5)"
                          keyboardType="email-address"
                          inputMode="email"
                        />
                      )}
                    />
                    <NoticeCard>
                      <NoticeRow>
                        <Ionicons name="alert-circle" size={18} color="#0b2f2d" />
                        <NoticeTitle>Importante</NoticeTitle>
                      </NoticeRow>
                      <NoticeBody>
                        Após informar seu e-mail de cadastro, você receberá um código de recuperação no mesmo e-mail.
                      </NoticeBody>
                    </NoticeCard>
                  </FormGroup>
                </Form>
              </Middle>

              <Bottom>
                <PrimaryCta onPress={handleSubmit(onSubmit)}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <PrimaryCtaLabel>receber código</PrimaryCtaLabel>
                    <Ionicons name="mail-outline" size={18} color="#ffffff" />
                  </View>
                </PrimaryCta>
              </Bottom>
            </ContentView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </BackgroundView>
    </Screen>
  );
}
