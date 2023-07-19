import { IsString, IsNotEmpty } from 'class-validator';

export class FindOneUserDto {
  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  readonly username: string;
}
