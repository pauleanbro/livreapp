import { useRouter } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  BackgroundView,
  Bottom,
  CheckboxRow,
  ContentView,
  Form,
  FormGroup,
  Link,
  LinkText,
  Middle,
  Support,
  SupportText,
  TitleLarge,
} from "./styles";

import {
  ButtonText,
  Checkbox as CheckboxControl,
  PrimaryButton,
  Input as TextInputControl,
} from "@/components/ui/controls";
import { EServices, useServices } from "@/hooks/useServices";
import { useAuthStore } from "@/stores/authStore";
import { Screen } from "@/styles/shared";

type LoginFormProps = {
  username: string;
  password: string;
  remember?: boolean;
};

export default function Auth() {
  const router = useRouter();
  const authService = useServices(EServices.AuthService);
  const setAuth = useAuthStore((state) => state.setAuth);

  const { control, handleSubmit } = useForm<LoginFormProps>({
    defaultValues: { username: "", password: "", remember: false },
  });

  const onSubmit = async (data: LoginFormProps) => {
    try {
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
    }
  };

  const insets = useSafeAreaInsets();

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
                <TitleLarge>Sua conta</TitleLarge>
                <Form>
                  <FormGroup>
                    <Controller
                      control={control}
                      name="username"
                      render={({ field: { onChange, value } }) => (
                        <TextInputControl
                          label="E-mail"
                          labelStyle={{ color: "#EEFFEF" }}
                          value={value}
                          onChangeText={onChange}
                          inputStyle={{
                            borderColor: "#EEFFEF",
                            color: "#EEFFEF",
                          }}
                        />
                      )}
                    />

                    <Controller
                      control={control}
                      name="password"
                      render={({ field: { onChange, value } }) => (
                        <TextInputControl
                          label="Senha"
                          labelStyle={{ color: "#EEFFEF" }}
                          secureTextEntry
                          value={value}
                          onChangeText={onChange}
                          inputStyle={{
                            borderColor: "#EEFFEF",
                            color: "#EEFFEF",
                          }}
                        />
                      )}
                    />

                    <CheckboxRow>
                      <Controller
                        control={control}
                        name="remember"
                        render={({ field: { value, onChange } }) => (
                          <CheckboxControl
                            labelStyle={{ color: "#EEFFEF" }}
                            label="Salvar dados de login para novos acessos"
                            value={!!value}
                            onValueChange={onChange}
                          />
                        )}
                      />
                    </CheckboxRow>
                  </FormGroup>
                </Form>
              </Middle>

              <Bottom>
                <Support>
                  <SupportText>Problemas para fazer login?</SupportText>
                  <Link onPress={() => {}}>
                    <LinkText>Clique para recuperar seu acesso</LinkText>
                  </Link>
                </Support>

                <PrimaryButton onPress={handleSubmit(onSubmit as any)}>
                  <ButtonText>Entrar</ButtonText>
                </PrimaryButton>
              </Bottom>
            </ContentView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </BackgroundView>
    </Screen>
  );
}

// styles moved to ./styles.ts
