export interface IEnvs {
  API_URL: string;
}

const required = (value: string | undefined, key: keyof IEnvs) => {
  if (!value) {
    throw new Error(`Missing env ${key}`);
  }
  return value;
};

export const envs: IEnvs = {
  API_URL: required(process.env.EXPO_PUBLIC_API_URL, "API_URL"),
};
