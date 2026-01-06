import { axiosAdapter, AxiosAdapter } from "@/utils/axiosAdapter";

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

type CompanyVerificationRawResponse = Record<string, unknown>;

const toStringValue = (value: unknown): string | undefined => {
  if (value == null) {
    return undefined;
  }
  if (typeof value === "string" && value.trim().length) {
    return value.trim();
  }
  if (typeof value === "number" || typeof value === "bigint") {
    return String(value);
  }
  return undefined;
};

const pickFirstString = (data: CompanyVerificationRawResponse, keys: readonly string[]): string | undefined => {
  for (const key of keys) {
    const candidate = toStringValue(data[key]);
    if (candidate) {
      return candidate;
    }
  }
  return undefined;
};

const normalizeCompanyVerificationResponse = (payload: CompanyVerificationRawResponse): CompanyVerificationResponse => {
  const nameKeys = [
    "corporateName",
    "razaoSocial",
    "razao_social",
    "nomeEmpresa",
    "nome_empresa",
    "nomeFantasia",
    "nome_fantasia",
    "nome",
  ] as const;
  const addressKeys = ["address", "endereco", "logradouro", "rua", "enderecoCompleto"] as const;
  const cityKeys = ["city", "cidade", "municipio", "localidade"] as const;
  const stateKeys = ["state", "uf", "estado"] as const;
  const cepKeys = ["cep", "zip", "codigoPostal", "codigo_postal"] as const;

  return {
    corporateName: pickFirstString(payload, nameKeys) ?? "",
    cep: pickFirstString(payload, cepKeys) ?? "",
    address: pickFirstString(payload, addressKeys) ?? "",
    city: pickFirstString(payload, cityKeys) ?? "",
    state: pickFirstString(payload, stateKeys) ?? "",
  };
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
    const response = await this.http.post<CompanyVerificationRawResponse>(
      "/onboarding/empresa-socio",
      payload,
    );
    return normalizeCompanyVerificationResponse(response);
  }

  async finalize(payload: FinalizeOnboardingPayload) {
    await this.http.post("/onboarding", payload);
  }
}

export const onboardingService: OnboardingService = new OnboardingServiceImpl(
  axiosAdapter,
);
