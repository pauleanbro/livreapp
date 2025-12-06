import { useRouter } from "expo-router";
import React from "react";
import styled from "styled-components/native";

import { EServices, useServices } from "@/hooks/useServices";
import { Body, Content, Screen, Title } from "@/styles/shared";
import { ThemedProps } from "@/styles/shared";
import { useAuthStore } from "@/stores/authStore";

export default function Dashboard() {
  const router = useRouter();
  const authService = useServices(EServices.AuthService);
  const role = useAuthStore((state) => state.role);
  const permissions = useAuthStore((state) => state.permissions);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const handleLogout = () => {
    clearAuth();
    authService.logout();
    router.replace("/auth");
  };

  return (
    <Screen>
      <Content>
        <Title>Dashboard</Title>
        <Body>Role: {role ?? "N/A"}</Body>
        <Body>Permissões: {permissions.join(", ") || "Nenhuma"}</Body>
        <Spacer />
        <LogoutButton onPress={handleLogout}>
          <ButtonText>Sair</ButtonText>
        </LogoutButton>
      </Content>
    </Screen>
  );
}

const LogoutButton = styled.TouchableOpacity`
  margin-top: ${({ theme }: ThemedProps) => theme.spacing(2)}px;
  padding: ${({ theme }: ThemedProps) => theme.spacing(1.5)}px;
  border-radius: ${({ theme }: ThemedProps) => theme.radius.sm}px;
  background-color: ${({ theme }: ThemedProps) => theme.colors.primary};
  align-items: center;
`;

const ButtonText = styled.Text`
  color: ${({ theme }: ThemedProps) => theme.colors.text};
  font-weight: 700;
`;

const Spacer = styled.View`
  height: ${({ theme }: ThemedProps) => theme.spacing(1)}px;
`;
