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
exports.SetAlertDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class SetAlertDto {
}
exports.SetAlertDto = SetAlertDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The blockchain to set the alert for, e.g., Ethereum',
    }),
    __metadata("design:type", String)
], SetAlertDto.prototype, "chain", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The target dollar price to trigger the alert' }),
    __metadata("design:type", Number)
], SetAlertDto.prototype, "dollar", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email to send the alert to when the target price is reached',
    }),
    __metadata("design:type", String)
], SetAlertDto.prototype, "email", void 0);
//# sourceMappingURL=alerts.dto.js.map