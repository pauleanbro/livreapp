import { axiosAdapter, AxiosAdapter } from "@/utils/axiosAdapter";

export enum BioStatus {
  Pending = "Pending",
  Done = "Done",
  Failed = "Failed",
}

export type PersonalData = {
  fullName: string;
  cpf: string;
  email: string;
  phone: string;
  birthdate: string; // DD/MM/YYYY
  mothersName: string;
};

export type EmailOtpPayload = {
  email: string;
};

export type EmailOtpValidationPayload = {
  email: string;
  token: string;
};

export type CompanyVerificationPayload = {
  cnpj: string;
  cpf: string;
  nome_socio: string;
};

export type CompanyVerificationResponse = {
  corporateName: string;
  cep: string;
  address: string;
  city: string;
  state: string;
};

export type BioLinkPayload = {
  document: string;
  name: string;
  birthdate: string; // YYYY-MM-DD
  email: string;
  mothersName: string;
  verifiedEmail: boolean;
};

export type BioLinkResponse = {
  transactionId: string;
  biolinkUrl: string;
  qrCodeUrl?: string;
};

export type BioStatusResponse = {
  transactionId: string;
  status: BioStatus;
};

export type FinalizeOnboardingPayload = {
  fullName: string;
  cpf: string;
  email: string;
  phone: string;
  cnpj: string;
  corporateName: string;
  cep: string;
  address: string;
  city: string;
  state: string;
  birthdate: string;
  mothersName: string;
  identityVerified: string;
  isAdmin: boolean;
  consentReceivables?: boolean;
  acceptTerms: boolean;
  receiveUpdates?: boolean;
  notPep: boolean;
  transaction_id?: string;
};

export interface OnboardingService {
  sendEmailToken(payload: EmailOtpPayload): Promise<void>;
  validateEmailToken(payload: EmailOtpValidationPayload): Promise<void>;
  verifyCompany(
    payload: CompanyVerificationPayload,
  ): Promise<CompanyVerificationResponse>;
  createBioLink(payload: BioLinkPayload): Promise<BioLinkResponse>;
  fetchBioStatus(transactionId: string): Promise<BioStatusResponse>;
  finalize(payload: FinalizeOnboardingPayload): Promise<void>;
}

class OnboardingServiceImpl implements OnboardingService {
  constructor(private readonly http: AxiosAdapter) {}

  async sendEmailToken(payload: EmailOtpPayload) {
    await this.http.post("/enviar-token-validacao", payload);
  }

  async validateEmailToken(payload: EmailOtpValidationPayload) {
    await this.http.post("/validar-token-email", {
      email: payload.email,
      token: payload.token,
    });
  }

  async verifyCompany(
    payload: CompanyVerificationPayload,
  ): Promise<CompanyVerificationResponse> {
    const response = await this.http.post<CompanyVerificationResponse>(
      "/onboarding/empresa-socio",
      payload,
    );
    return response;
  }

  // ClearSale mocked for now
  async createBioLink(_: BioLinkPayload): Promise<BioLinkResponse> {
    return Promise.resolve({
      transactionId: `mock-transaction-${Date.now()}`,
      biolinkUrl: "https://livre.digital/biometria-mock",
      qrCodeUrl: "https://via.placeholder.com/180?text=Biometria+Mock",
    });
  }

  async fetchBioStatus(transactionId: string): Promise<BioStatusResponse> {
    return Promise.resolve({
      transactionId,
      status: BioStatus.Done,
    });
  }

  async finalize(payload: FinalizeOnboardingPayload) {
    await this.http.post("/onboarding", payload);
  }
}

export const onboardingService: OnboardingService = new OnboardingServiceImpl(
  axiosAdapter,
);
