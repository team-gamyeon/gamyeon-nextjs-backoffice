export interface Admin {
  id: string;
  name: string;
  email: string;
}

export interface AdminLoginPayload {
  email: string;
  password: string;
}
