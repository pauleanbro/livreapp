import { axiosAdapter, AxiosAdapter } from "@/utils/axiosAdapter";
import { handleApiError } from "@/utils/handleApiError";

export type LoginPayload = {
  username: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
  role: string;
  permissions: string[];
};

export interface AuthService {
  login(payload: LoginPayload): Promise<LoginResponse>;
  logout(): void;
}

export class AuthServiceImpl implements AuthService {
  constructor(private readonly http: AxiosAdapter) {}

  login = async (payload: LoginPayload): Promise<LoginResponse> => {
    const maskedPayload = { ...payload, password: "***" };
    console.log("[AuthService] Login request payload:", maskedPayload);

    const body = new URLSearchParams();
    body.append("username", payload.username);
    body.append("password", payload.password);

    try {
      const response = await this.http.post<LoginResponse>("/login", body, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      console.log("[AuthService] Login response:", response);
      this.http.setToken(response.access_token);
      return response;
    } catch (error: any) {
      // Use centralized handler for user feedback and dev logging
      handleApiError(error, { logLabel: "[AuthService] Login error", variant: "destructive" });
      throw error;
    }
  };

  logout = () => {
    this.http.setToken(undefined);
  };
}

export const authService = new AuthServiceImpl(axiosAdapter);
