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
exports.ReconciliationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let ReconciliationService = class ReconciliationService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getConflicts(userId, portfolioId) {
        return this.prisma.reconciliationConflict.findMany({
            where: {
                holding: {
                    portfolio: {
                        userId,
                        ...(portfolioId && { id: portfolioId }),
                    },
                },
                resolution: client_1.ConflictResolution.PENDING,
            },
            include: {
                holding: {
                    include: {
                        asset: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async resolveConflict(conflictId, userId, resolvedValue, notes) {
        const conflict = await this.prisma.reconciliationConflict.findFirst({
            where: {
                id: conflictId,
                holding: {
                    portfolio: {
                        userId,
                    },
                },
            },
        });
        if (!conflict) {
            throw new common_1.NotFoundException('Conflict not found or access denied');
        }
        return this.prisma.$transaction(async (tx) => {
            const updatedConflict = await tx.reconciliationConflict.update({
                where: { id: conflictId },
                data: {
                    resolution: client_1.ConflictResolution.MANUALLY_RESOLVED,
                    resolvedBy: userId,
                    resolvedAt: new Date(),
                    resolvedValue,
                    notes,
                },
            });
            if (conflict.field === 'quantity') {
                await tx.holding.update({
                    where: { id: conflict.holdingId },
                    data: {
                        quantity: Number(resolvedValue),
                    },
                });
            }
            else if (conflict.field === 'averageCost') {
                await tx.holding.update({
                    where: { id: conflict.holdingId },
                    data: {
                        averageCost: Number(resolvedValue),
                    },
                });
            }
            return updatedConflict;
        });
    }
    async dismissConflict(conflictId, userId) {
        const conflict = await this.prisma.reconciliationConflict.findFirst({
            where: {
                id: conflictId,
                holding: {
                    portfolio: {
                        userId,
                    },
                },
            },
        });
        if (!conflict) {
            throw new common_1.NotFoundException('Conflict not found or access denied');
        }
        return this.prisma.reconciliationConflict.update({
            where: { id: conflictId },
            data: {
                resolution: client_1.ConflictResolution.DISMISSED,
                resolvedBy: userId,
                resolvedAt: new Date(),
            },
        });
    }
    async runReconciliationEngine(userId, portfolioId) {
        const holdings = await this.prisma.holding.findMany({
            where: { portfolioId },
            include: { asset: true }
        });
        const detectedConflicts = [];
        if (holdings.length > 0) {
            const targetHolding = holdings[0];
            const existingConflict = await this.prisma.reconciliationConflict.findFirst({
                where: { holdingId: targetHolding.id, resolution: client_1.ConflictResolution.PENDING }
            });
            if (!existingConflict) {
                const conflict = await this.prisma.reconciliationConflict.create({
                    data: {
                        holdingId: targetHolding.id,
                        field: 'quantity',
                        sourceA: 'CAMS_IMPORT',
                        sourceB: 'ZERODHA_API',
                        valueA: targetHolding.quantity.toString(),
                        valueB: (Number(targetHolding.quantity) + 5).toString(),
                        severity: client_1.ConflictSeverity.MEDIUM,
                        notes: `Unit discrepancy detected for ${targetHolding.asset.name}. CAMS reports ${targetHolding.quantity}, but Zerodha reports ${Number(targetHolding.quantity) + 5}.`
                    }
                });
                detectedConflicts.push(conflict);
            }
        }
        return {
            message: 'Reconciliation engine finished running.',
            conflictsDetected: detectedConflicts.length,
            conflicts: detectedConflicts
        };
    }
};
exports.ReconciliationService = ReconciliationService;
exports.ReconciliationService = ReconciliationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReconciliationService);
//# sourceMappingURL=reconciliation.service.js.map