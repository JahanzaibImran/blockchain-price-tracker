import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AlertsService } from './alerts.service';
import { CreateAlertDto, AlertResponseDto } from './dto/alert.dto';

@ApiTags('alerts')
@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertService: AlertsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new price alert' })
  @ApiResponse({
    status: 201,
    description: 'The alert has been successfully created',
    type: AlertResponseDto,
  })
  async createAlert(
    @Body() createAlertDto: CreateAlertDto,
  ): Promise<AlertResponseDto> {
    return this.alertService.createAlert(
      createAlertDto.chain,
      createAlertDto.targetPrice,
      createAlertDto.email,
    );
  }
}
