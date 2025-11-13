import { IsString, IsInt, Min } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  telegramTaskId: string;

  @IsInt()
  @Min(1)
  rewardPoints: number;
}
