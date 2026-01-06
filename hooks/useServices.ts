import { authService, AuthService } from "@/services/auth.service";
import {
  clearSaleService,
  ClearSaleService,
} from "@/services/clearSale.service";
import {
  onboardingService,
  OnboardingService,
} from "@/services/onboarding.service";

export enum EServices {
  AuthService = "AuthService",
  ClearSaleService = "ClearSaleService",
  OnboardingService = "OnboardingService",
}

interface TServices {
  [EServices.AuthService]: AuthService;
  [EServices.ClearSaleService]: ClearSaleService;
  [EServices.OnboardingService]: OnboardingService;
}

const servicesMap: { [K in EServices]: TServices[K] } = {
  [EServices.AuthService]: authService,
  [EServices.ClearSaleService]: clearSaleService,
  [EServices.OnboardingService]: onboardingService,
};

export const useServices = <T extends EServices>(service: T): TServices[T] => {
  return servicesMap[service];
};
