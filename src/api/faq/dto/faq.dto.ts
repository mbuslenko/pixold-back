import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateFaqDto {
  @IsUUID()
  @IsNotEmpty()
  topicId: string;

  @IsString()
  @IsNotEmpty()
  question: string;

  @IsString()
  @IsNotEmpty()
  answer: string;
}
