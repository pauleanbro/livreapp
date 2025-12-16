import { authService, AuthService } from "@/services/auth.service";
import {
  onboardingService,
  OnboardingService,
} from "@/services/onboarding.service";

export enum EServices {
  AuthService = "AuthService",
  OnboardingService = "OnboardingService",
}

interface TServices {
  [EServices.AuthService]: AuthService;
  [EServices.OnboardingService]: OnboardingService;
}

const servicesMap: { [K in EServices]: TServices[K] } = {
  [EServices.AuthService]: authService,
  [EServices.OnboardingService]: onboardingService,
};

export const useServices = <T extends EServices>(service: T): TServices[T] => {
  return servicesMap[service];
};
