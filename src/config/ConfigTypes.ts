export interface JwtConfigOptions {
  secret: string;
  signOptions: {
    expiresIn: string;
  };
}

export interface MailerConfigOptions {
  transport: {
    service?: string;
    host?: string;
    port?: number;
    auth: {
      user: string;
      pass: string;
    };
  };
  defaults: {
    from: string;
  };
}
