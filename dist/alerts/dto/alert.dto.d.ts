export declare class CreateAlertDto {
    chain: string;
    targetPrice: number;
    email: string;
}
export declare class AlertResponseDto {
    id: number;
    chain: string;
    targetPrice: number;
    email: string;
    triggered: boolean;
}
