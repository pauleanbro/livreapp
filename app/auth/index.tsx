import { useRouter } from "expo-router";
import React, { useState } from "react";
import { TextInputProps } from "react-native";
import styled from "styled-components/native";

import { EServices, useServices } from "@/hooks/useServices";
import { useAuthStore } from "@/stores/authStore";
import { Body, Card, Content, Screen, ThemedProps, Title } from "@/styles/shared";

export default function Auth() {
  const router = useRouter();
  const authService = useServices(EServices.AuthService);
  const setAuth = useAuthStore((state) => state.setAuth);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      console.log("Dados de login enviados:", { username, password });
      const res = await authService.login({ username, password });
      setAuth({ accessToken: res.access_token, role: res.role, permissions: res.permissions });
      router.replace("/dashboard");
    } catch (err) {
      setError("Falha no login. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <Content>
        <Card>
          <Title>Auth Screen</Title>
          <Body>Construa sua autenticação aqui.</Body>
          <Spacer />
          <Input
            placeholder="Email ou usuário"
            autoCapitalize="none"
            value={username}
            onChangeText={setUsername}
          />
          <Input
            placeholder="Senha"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          {error ? <ErrorText>{error}</ErrorText> : null}
          <Button disabled={loading} onPress={handleLogin}>
            <ButtonText>{loading ? "Entrando..." : "Entrar"}</ButtonText>
          </Button>
        </Card>
      </Content>
    </Screen>
  );
}

const Input = styled.TextInput<TextInputProps>`
  border-width: 1px;
  border-color: ${({ theme }: ThemedProps) => theme.colors.border};
  color: ${({ theme }: ThemedProps) => theme.colors.text};
  padding: ${({ theme }: ThemedProps) => theme.spacing(1)}px;
  border-radius: ${({ theme }: ThemedProps) => theme.radius.sm}px;
  margin-bottom: ${({ theme }: ThemedProps) => theme.spacing(1)}px;
`;

const Button = styled.TouchableOpacity`
  background-color: ${({ theme }: ThemedProps) => theme.colors.primary};
  padding: ${({ theme }: ThemedProps) => theme.spacing(1.5)}px;
  border-radius: ${({ theme }: ThemedProps) => theme.radius.sm}px;
  align-items: center;
  justify-content: center;
`;

const ButtonText = styled.Text`
  color: ${({ theme }: ThemedProps) => theme.colors.text};
  font-weight: 700;
`;

const ErrorText = styled.Text`
  color: red;
  margin-bottom: ${({ theme }: ThemedProps) => theme.spacing(1)}px;
`;

const Spacer = styled.View`
  height: ${({ theme }: ThemedProps) => theme.spacing(1)}px;
`;
