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
exports.PriceResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class PriceResponseDto {
}
exports.PriceResponseDto = PriceResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-01T00:00:00Z' }),
    __metadata("design:type", Date)
], PriceResponseDto.prototype, "timestamp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2000.5 }),
    __metadata("design:type", Number)
], PriceResponseDto.prototype, "ethereum", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1.2 }),
    __metadata("design:type", Number)
], PriceResponseDto.prototype, "polygon", void 0);
//# sourceMappingURL=price-response.dto.js.map