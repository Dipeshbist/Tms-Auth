export interface JwtConfig {
  secret: string;
  signOptions: {
    expiresIn: string;
  };
}

export interface MailerConfig {
  transport: {
    host: string;
    port: number;
    auth: {
      user: string;
      pass: string;
    };
  };
  defaults: {
    from: string;
  };
}
