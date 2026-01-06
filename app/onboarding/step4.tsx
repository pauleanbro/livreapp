import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import { ErrorBanner } from "@/components/ui/controls";
import { useOnboardingStore } from "@/stores/onboardingStore";
import { Screen } from "@/components/ui/shared";
import { Environments, useCSLiveness } from "csliveness-react-native";
import { Ionicons } from "@expo/vector-icons";
import { digitOnly, birthdateToISO } from "@/shared/onboarding/utils";
import { envs } from "@/constants/envs";
import { EServices, useServices } from "@/hooks/useServices";
import {
  CtaButton,
  CtaLabel,
  CameraCard,
  CameraCardSubText,
  CameraCardText,
  ContentPadding,
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
  TipList,
  TipItem,
  TipIcon,
  TipText,
  ScrollArea,
} from "./styles";
import { StatusBar } from "expo-status-bar";

export default function OnboardingStep4() {
  const router = useRouter();
  const store = useOnboardingStore();
  const {
    companyVerified,
    cpf,
    email,
    fullName,
    identityVerified,
    mothersName,
    birthdate,
    setIdentity,
    transactionId,
  } = store;

  const { open } = useCSLiveness();
  const clearSaleService = useServices(EServices.ClearSaleService);

  const [error, setError] = useState<string | null>(null);
  const [livenessLoading, setLivenessLoading] = useState(false);
  const [transactionLoading, setTransactionLoading] = useState(false);
  const [clearSaleToken, setClearSaleToken] = useState<string | null>(null);
  const clearSaleTokenRef = React.useRef<string | null>(null);
  const envCheckedRef = React.useRef(false);
  const initRef = React.useRef(false);
  const isHmlUrl = /hml|homolog/i.test(envs.CLEARSALE_DATATRUST_API_URL);
  const sdkEnvironment = isHmlUrl ? Environments.HML : Environments.PRD;

  useEffect(() => {
    if (envCheckedRef.current) return;
    envCheckedRef.current = true;
    const apiUrl = envs.CLEARSALE_DATATRUST_API_URL;
    const isSdkHml = sdkEnvironment === Environments.HML;
    if (isHmlUrl !== isSdkHml) {
      console.warn("[ClearSale] Ambiente divergente", {
        datatrustUrl: apiUrl,
        sdkEnv: isSdkHml ? "HML" : "PRD",
      });
    }
  }, []);

  useEffect(() => {
    if (!fullName || !cpf || !email) {
      router.replace("/onboarding");
      return;
    }
    if (!companyVerified) {
      router.replace("/onboarding/step3");
      return;
    }
    if (identityVerified) {
      return;
    }
  }, [companyVerified, email, fullName, identityVerified, cpf, router]);

  useEffect(() => {
    if (!fullName || !cpf || !email || !companyVerified || identityVerified) {
      return;
    }
    const needsInit = !clearSaleTokenRef.current || !transactionId;
    if (!needsInit) {
      return;
    }
    if (initRef.current) {
      return;
    }
    initRef.current = true;

    let isMounted = true;

    const initializeTransaction = async () => {
      setTransactionLoading(true);
      setError(null);
      try {
        let token = clearSaleTokenRef.current;
        if (!token) {
          token = await clearSaleService.authenticate();
          if (!isMounted) return;
          clearSaleTokenRef.current = token;
          setClearSaleToken(token);
        }

        if (transactionId) {
          return;
        }

        if (!birthdate || !mothersName) {
          throw new Error("Informe data de nascimento e nome da mãe para gerar a transação.");
        }

        const payload = {
          documentType: "CPF",
          document: digitOnly(cpf),
          name: fullName,
          birthdate: birthdateToISO(birthdate),
          mothersName,
          email,
          verifiedEmail: false,
        };

        const created = await clearSaleService.createTransaction(token, payload);
        if (!isMounted) return;
        setIdentity({
          transactionId: created.transactionId,
          identityVerified: undefined,
        });
      } catch (creationError) {
        if (!isMounted) return;
        const message =
          typeof creationError === "string"
            ? creationError
            : creationError instanceof Error
            ? creationError.message
            : "Não foi possível gerar a transação.";
        setError(message);
      } finally {
        if (isMounted) {
          setTransactionLoading(false);
        }
        initRef.current = false;
      }
    };

    void initializeTransaction();

    return () => {
      isMounted = false;
    };
  }, [
    birthdate,
    clearSaleService,
    companyVerified,
    cpf,
    email,
    fullName,
    identityVerified,
    mothersName,
    setIdentity,
  ]);

  const handleOpenLiveness = async () => {
    const hasPermission =
      Platform.OS !== "android"
        ? true
        : await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
    if (!hasPermission) {
      const status = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
        title: "Permissão de câmera",
        message: "Precisamos da câmera para realizar a verificação de biometria.",
        buttonPositive: "Permitir",
      });
      if (status !== PermissionsAndroid.RESULTS.GRANTED) {
        setError("Permissão de câmera negada.");
        return;
      }
    }
    if (!transactionId) {
      setError("Transação ainda não disponível.");
      return;
    }
    if (!clearSaleToken) {
      setError("Token da ClearSale indisponível no momento.");
      return;
    }
    console.log("[ClearSale] open request", {
      datatrustUrl: envs.CLEARSALE_DATATRUST_API_URL,
      sdkEnv: sdkEnvironment === Environments.HML ? "HML" : "PRD",
      hasToken: Boolean(clearSaleToken),
      hasTransactionId: Boolean(transactionId),
      transactionId,
    });
    setError(null);
    setLivenessLoading(true);
    try {
      const result = await open({
        transactionId,
        accessToken: clearSaleToken,
        environment: sdkEnvironment,
        vocalGuidance: true,
        primaryColor: "#44EAA2",
        secondaryColor: "#0F5660",
        titleColor: "#0F5660",
        paragraphColor: "#064D4C",
      });
      console.log("[ClearSale] open response", {
        real: result?.real,
        responseMessage: result?.responseMessage,
        sessionId: result?.sessionId,
        hasImage: Boolean(result?.image),
      });
      if (result.real) {
        store.setIdentity({
          transactionId,
          identityVerified: result.sessionId || transactionId,
        });
        console.log("[ClearSale] transactionId", transactionId);
        router.push("/onboarding/step5");
      } else {
        setError("Não foi possível confirmar a biometria.");
      }
    } catch (openError) {
      const message =
        typeof openError === "string"
          ? openError
          : openError instanceof Error
          ? openError.message
          : "Erro ao abrir o SDK de biometria.";
      console.error("[Onboarding] handleOpenLiveness failed", { openError, message });
      setError(message);
    } finally {
      setLivenessLoading(false);
    }
  };

  return (
    <Screen style={{ backgroundColor: "#F7FAF8" }}>
      <StatusBar style="dark" />
      <MainContent>
        <ScrollArea>
          <ContentPadding>
            <OnboardingHeader>
              <OnboardingTopRow>
                <HeroBackButton onPress={() => router.replace("/onboarding/step3")}>
                  <Ionicons name="arrow-back" size={20} color="#0b2f2d" />
                </HeroBackButton>
              </OnboardingTopRow>
              <HeaderDivider />
            </OnboardingHeader>
            {error ? <ErrorBanner>{error}</ErrorBanner> : null}
            <QuestionBlock>
              <QuestionRow>
                <QuestionLead>Agora é a</QuestionLead>
                <QuestionHighlight>biometria facial</QuestionHighlight>
              </QuestionRow>
              <QuestionSubtitle>Leva menos de 1 minuto e só precisa ser feito uma vez.</QuestionSubtitle>
            </QuestionBlock>
            <InputBlock>
              <QuestionSubtitle>Antes de começar:</QuestionSubtitle>
              <TipList>
                <TipItem>
                  <TipIcon>
                    <Ionicons name="sunny-outline" size={16} color="#027E68" />
                  </TipIcon>
                  <TipText>Esteja em um local bem iluminado</TipText>
                </TipItem>
                <TipItem>
                  <TipIcon>
                    <Ionicons name="scan-outline" size={16} color="#027E68" />
                  </TipIcon>
                  <TipText>Mantenha o rosto centralizado e sem óculos escuros</TipText>
                </TipItem>
                <TipItem>
                  <TipIcon>
                    <Ionicons name="alert-circle-outline" size={16} color="#027E68" />
                  </TipIcon>
                  <TipText>Evite sombras fortes ou contraluz</TipText>
                </TipItem>
              </TipList>
            </InputBlock>
            <InputBlock>
              <CameraCard
                disabled={
                  !store.transactionId || transactionLoading || livenessLoading || !clearSaleToken
                }
                onPress={handleOpenLiveness}
                activeOpacity={0.8}
              >
                <Ionicons name="camera-outline" size={40} color="#027E68" />
                <CameraCardText>Iniciar biometria</CameraCardText>
                <CameraCardSubText>
                  {transactionLoading
                    ? "Criando um ambiente seguro"
                    : livenessLoading
                    ? "Abrindo verificação..."
                    : "Toque para começar o reconhecimento"}
                </CameraCardSubText>
              </CameraCard>
            </InputBlock>
          </ContentPadding>
        </ScrollArea>
      </MainContent>

      {store.identityVerified ? (
        <FooterBar>
          <CtaButton onPress={() => router.push("/onboarding/step5")}>
            <CtaLabel>avançar</CtaLabel>
            <Ionicons name="arrow-forward" size={18} color="#ffffff" />
          </CtaButton>
        </FooterBar>
      ) : null}
    </Screen>
  );
}
