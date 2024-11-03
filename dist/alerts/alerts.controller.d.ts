import { AlertsService } from './alerts.service';
import { CreateAlertDto, AlertResponseDto } from './dto/alert.dto';
export declare class AlertsController {
    private readonly alertService;
    constructor(alertService: AlertsService);
    createAlert(createAlertDto: CreateAlertDto): Promise<AlertResponseDto>;
}
