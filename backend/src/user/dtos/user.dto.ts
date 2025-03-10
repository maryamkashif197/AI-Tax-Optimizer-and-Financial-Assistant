import { User } from "src/user/model/user.schema";

export class CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profile_picture_url?: string;
  role?: string;
}

export class updateUserDto {
  name?: string;
  email?: string;
  password?: string;
  profile_picture_url?: string;
}

export class UserDto {
  constructor(user: User) {
    const userDto: UserDto = {
      _id: user._id,
      name: user.name,
      email: user.email,
      profile_picture_url: user.profile_picture_url,
      role: user?.role,
    };
    return userDto;
  }
  _id: string;
  name: string;
  profile_picture_url: string;
  email?: string;
  role?: string;
}
