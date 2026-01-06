export interface IEnvs {
  API_URL: string;
  CLEARSALE_USERNAME: string;
  CLEARSALE_PASSWORD: string;
  CLEARSALE_DATATRUST_API_URL: string;
}

const required = (value: string | undefined, key: keyof IEnvs) => {
  if (!value) {
    throw new Error(`Missing env ${key}`);
  }
  return value;
};

export const envs: IEnvs = {
  API_URL: required(process.env.EXPO_PUBLIC_API_URL, "API_URL"),
  CLEARSALE_USERNAME: required(
    process.env.EXPO_PUBLIC_CLEARSALE_USERNAME,
    "CLEARSALE_USERNAME",
  ),
  CLEARSALE_PASSWORD: required(
    process.env.EXPO_PUBLIC_CLEARSALE_PASSWORD,
    "CLEARSALE_PASSWORD",
  ),
  CLEARSALE_DATATRUST_API_URL:
    process.env.EXPO_PUBLIC_CLEARSALE_DATATRUST_API_URL ??
    "https://datatrustapihml.clearsale.com.br/v1",
};
