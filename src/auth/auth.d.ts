import { User } from '../user/user.entity';

export interface AuthResponse {
  token: string;
  user: User;
}
