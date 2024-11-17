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
