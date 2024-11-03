"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertResponseDto = exports.CreateAlertDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateAlertDto {
}
exports.CreateAlertDto = CreateAlertDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: ['ethereum', 'polygon'],
        description: 'The blockchain to monitor',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['ethereum', 'polygon']),
    __metadata("design:type", String)
], CreateAlertDto.prototype, "chain", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Target price in USD',
        example: 1000,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateAlertDto.prototype, "targetPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email address to send the alert to',
        example: 'user@example.com',
    }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateAlertDto.prototype, "email", void 0);
class AlertResponseDto {
}
exports.AlertResponseDto = AlertResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AlertResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AlertResponseDto.prototype, "chain", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AlertResponseDto.prototype, "targetPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AlertResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], AlertResponseDto.prototype, "triggered", void 0);
//# sourceMappingURL=alert.dto.js.map