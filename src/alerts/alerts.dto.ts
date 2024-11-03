import { ApiProperty } from '@nestjs/swagger';

export class SetAlertDto {
  @ApiProperty({
    description: 'The blockchain to set the alert for, e.g., Ethereum',
  })
  chain: string;

  @ApiProperty({ description: 'The target dollar price to trigger the alert' })
  dollar: number;

  @ApiProperty({
    description: 'Email to send the alert to when the target price is reached',
  })
  email: string;
}
