import { ApiProperty } from '@nestjs/swagger';

export class PriceResponseDto {
  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  timestamp: Date;

  @ApiProperty({ example: 2000.5 })
  ethereum: number;

  @ApiProperty({ example: 1.2 })
  polygon: number;
}
