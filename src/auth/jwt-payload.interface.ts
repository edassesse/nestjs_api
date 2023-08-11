export interface JwtPayload {
  email: string,
  origin: "web" | "app";
}
