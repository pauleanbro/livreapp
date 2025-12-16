import { create } from "zustand";

import { CompanyVerificationResponse, PersonalData } from "@/services/onboarding.service";

export type OnboardingState = PersonalData & {
  emailOtp: string;
  emailVerified: boolean;
  cnpj: string;
  corporateName: string;
  cep: string;
  address: string;
  city: string;
  state: string;
  companyVerified: boolean;
  isAdmin: boolean;
  consentReceivables: boolean;
  acceptTerms: boolean;
  receiveUpdates: boolean;
  notPep: boolean;
  identityVerified?: string;
  transactionId?: string;
};

const initialState: OnboardingState = {
  fullName: "",
  cpf: "",
  email: "",
  phone: "",
  birthdate: "",
  mothersName: "",
  emailOtp: "",
  emailVerified: false,
  cnpj: "",
  corporateName: "",
  cep: "",
  address: "",
  city: "",
  state: "",
  companyVerified: false,
  isAdmin: false,
  consentReceivables: false,
  acceptTerms: false,
  receiveUpdates: false,
  notPep: false,
  identityVerified: undefined,
  transactionId: undefined,
};

type OnboardingActions = {
  update: (data: Partial<OnboardingState>) => void;
  setPersonalData: (data: PersonalData) => void;
  setCompanyData: (data: CompanyVerificationResponse & { verified: boolean }) => void;
  setIdentity: (data: { transactionId?: string; identityVerified?: string }) => void;
  reset: () => void;
};

export const useOnboardingStore = create<OnboardingState & OnboardingActions>((set) => ({
  ...initialState,
  update: (data) => set((state) => ({ ...state, ...data })),
  setPersonalData: (data) => set((state) => ({ ...state, ...data })),
  setCompanyData: (data) =>
    set((state) => ({
      ...state,
      corporateName: data.corporateName,
      cep: data.cep,
      address: data.address,
      city: data.city,
      state: data.state,
      companyVerified: data.verified,
    })),
  setIdentity: (data) =>
    set((state) => ({
      ...state,
      transactionId: data.transactionId,
      identityVerified: data.identityVerified,
    })),
  reset: () => set(() => ({ ...initialState })),
}));
