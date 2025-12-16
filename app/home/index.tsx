import React from "react";
import { useRouter } from "expo-router";

import { Screen } from "@/styles/shared";
import { PrimaryButton, ButtonText as SharedButtonText } from "@/components/ui/controls";
import { Background, Container, Card, CardImage, Inner, Title, Logo, OutlineButton } from "./styles";

export default function Home() {
  const router = useRouter();

  return (
    <Screen>
      <Background source={require("@/assets/images/background_home.png")}>
        <Container>
          <Card>
            <CardImage source={require("@/assets/images/background_card_home.png")} />
            <Inner>
              <Title>Crédito emergencial para o seu negócio.</Title>

              <PrimaryButton onPress={() => router.push("/auth")}>
                <SharedButtonText>Acessar</SharedButtonText>
              </PrimaryButton>

              <OutlineButton onPress={() => router.push("/onboarding")}>
                <SharedButtonText style={{ color: "#ffffff" }}>Abrir conta</SharedButtonText>
              </OutlineButton>
            </Inner>
          </Card>

          <Logo source={require("@/assets/images/logo_index.png")} />
        </Container>
      </Background>
    </Screen>
  );
}
