import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Animated,
  Easing,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  BackButton,
  BackgroundView,
  Bottom,
  ContentView,
  Form,
  FormGroup,
  HeaderDivider,
  HeaderRow,
  Link,
  LinkText,
  Middle,
  PrimaryCta,
  PrimaryCtaLabel,
  Support,
  SupportText,
  TitleBlock,
  TitleHighlight,
  TitleLead,
  TitleRow,
  TitleSubtitle
} from "./styles";

import {
  Input as TextInputControl
} from "@/components/ui/controls";
import { Screen } from "@/components/ui/shared";
import { EServices, useServices } from "@/hooks/useServices";
import { useAuthStore } from "@/stores/authStore";
import { Ionicons } from "@expo/vector-icons";

type LoginFormProps = {
  username: string;
  password: string;
  remember?: boolean;
};

export default function Auth() {
  const router = useRouter();
  const authService = useServices(EServices.AuthService);
  const setAuth = useAuthStore((state) => state.setAuth);
  const [loading, setLoading] = useState(false);
  const loadingProgress = useRef(new Animated.Value(0)).current;
  const loadingLoop = useRef<Animated.CompositeAnimation | null>(null);

  const { control, handleSubmit } = useForm<LoginFormProps>({
    defaultValues: { username: "", password: "", remember: false },
  });

  const onSubmit = async (data: LoginFormProps) => {
    try {
      setLoading(true);
      const res = await authService.login({
        username: data.username,
        password: data.password,
      });
      setAuth({
        accessToken: res.access_token,
        role: res.role,
        permissions: res.permissions,
      });
      router.replace("/dashboard");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const insets = useSafeAreaInsets();
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
                    <TitleLead>Entrar na </TitleLead>
                    <TitleHighlight>sua conta</TitleHighlight>
                  </TitleRow>
                  <TitleSubtitle>Use seu e-mail e senha para continuar.</TitleSubtitle>
                </TitleBlock>
                <HeaderDivider />
                <Form>
                  <FormGroup>
                    <Controller
                      control={control}
                      name="username"
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

                    <Controller
                      control={control}
                      name="password"
                      render={({ field: { onChange, value } }) => (
                        <TextInputControl
                          label="Senha"
                          labelStyle={labelStyle}
                          secureTextEntry
                          value={value}
                          onChangeText={onChange}
                          inputStyle={inputStyle}
                          placeholder="Sua senha"
                          placeholderTextColor="rgba(11, 47, 45, 0.5)"
                          autoCapitalize="none"
                        />
                      )}
                    />
                  </FormGroup>
                </Form>
              </Middle>

              <Bottom>
                <Support>
                  <SupportText>Problemas para fazer login?</SupportText>
                  <Link onPress={() => router.push("/recovey")}>
                    <LinkText>Clique para recuperar seu acesso</LinkText>
                  </Link>
                </Support>

                <PrimaryCta disabled={loading} onPress={handleSubmit(onSubmit as any)}>
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
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      zIndex: 1,
                    }}
                  >
                    <PrimaryCtaLabel>{loading ? "entrando..." : "entrar"}</PrimaryCtaLabel>
                    <Ionicons name="arrow-forward" size={18} color="#ffffff" />
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

// styles moved to ./styles.ts
