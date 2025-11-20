export type User = {
  apiKey: string;
  role: "user" | "admin";
}

export const createUserFromOptions = (options: any): User => {
  return {
    apiKey: options.apiKey,
    role: options.role,
  }
}