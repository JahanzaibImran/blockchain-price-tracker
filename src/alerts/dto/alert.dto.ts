import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsEmail, IsIn } from 'class-validator';

export class CreateAlertDto {
  @ApiProperty({
    enum: ['ethereum', 'polygon'],
    description: 'The blockchain to monitor',
  })
  @IsString()
  @IsIn(['ethereum', 'polygon'])
  chain: string;

  @ApiProperty({
    description: 'Target price in USD',
    example: 1000,
  })
  @IsNumber()
  targetPrice: number;

  @ApiProperty({
    description: 'Email address to send the alert to',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;
}

export class AlertResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  chain: string;

  @ApiProperty()
  targetPrice: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  triggered: boolean;
}
