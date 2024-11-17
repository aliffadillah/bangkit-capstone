export class RegisterUserRequest {
  username: string;
  password: string;
  repeatPassword: string;
  name: string;
  email: string;
}

export class UserResponse {
  username: string;
  name: string;
  email?: string;
  token?: string;
  message?: string; // Add the message property here
}

export class LoginUserRequest {
  username: string;
  password: string;
}

export class UpdateUserRequest {
  name?: string;
  password?: string;
  email?: string;
}

export class LogoutResponse {
  username: string;
  name: string;
  message: string;
}
