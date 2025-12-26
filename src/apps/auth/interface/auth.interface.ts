export interface IJwtPayload {
  sub: string;
  email: string;
  sid: string;
  jti?: string;
}
