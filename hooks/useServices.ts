import { authService, AuthService } from "@/services/auth.service";

export enum EServices {
  AuthService = "AuthService",
}

interface TServices {
  [EServices.AuthService]: AuthService;
}

const servicesMap: { [K in EServices]: TServices[K] } = {
  [EServices.AuthService]: authService,
};

export const useServices = <T extends EServices>(service: T): TServices[T] => {
  return servicesMap[service];
};
