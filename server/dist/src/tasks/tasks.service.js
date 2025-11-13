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
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const tasks_verifiers_1 = require("tasks-verifiers");
let TasksService = class TasksService {
    prisma;
    telegramVerifier;
    constructor(prisma) {
        this.prisma = prisma;
        this.telegramVerifier = new tasks_verifiers_1.TelegramVerifier(process.env.TELEGRAM_BOT_TOKEN || '');
    }
    async createTask(createTaskDto) {
        return this.prisma.task.create({
            data: createTaskDto,
        });
    }
    async getAllTasks() {
        return this.prisma.task.findMany({
            orderBy: { createdAt: "desc" },
        });
    }
    async getTask(id) {
        const task = await this.prisma.task.findUnique({
            where: { id },
        });
        if (!task) {
            throw new common_1.NotFoundException("Task not found");
        }
        return task;
    }
    async getUserTasks(userId) {
        return this.prisma.userTask.findMany({
            where: { userId },
            include: { task: true },
        });
    }
    async verifyTaskCompletion(taskId, walletAddress) {
        const task = await this.getTask(taskId);
        let user = await this.prisma.user.findUnique({
            where: { walletAddress },
        });
        if (!user) {
            user = await this.prisma.user.create({
                data: { walletAddress },
            });
        }
        const existingUserTask = await this.prisma.userTask.findUnique({
            where: {
                userId_taskId: {
                    userId: user.id,
                    taskId: task.id,
                },
            },
        });
        if (existingUserTask?.verified) {
            throw new common_1.BadRequestException("Task already completed");
        }
        let isVerified = false;
        if (!process.env.TELEGRAM_BOT_TOKEN ||
            process.env.TELEGRAM_BOT_TOKEN.startsWith("test") ||
            process.env.TELEGRAM_BOT_TOKEN === "demo") {
            isVerified = true;
            console.log("Mock mode: Task verification auto-approved");
        }
        else {
            isVerified = await this.telegramVerifier.verify(walletAddress, task.telegramTaskId);
        }
        if (!isVerified) {
            throw new common_1.BadRequestException("Task verification failed");
        }
        await this.prisma.$transaction([
            this.prisma.userTask.upsert({
                where: {
                    userId_taskId: {
                        userId: user.id,
                        taskId: task.id,
                    },
                },
                create: {
                    userId: user.id,
                    taskId: task.id,
                    verified: true,
                    completedAt: new Date(),
                },
                update: {
                    verified: true,
                    completedAt: new Date(),
                },
            }),
            this.prisma.user.update({
                where: { id: user.id },
                data: {
                    score: {
                        increment: task.rewardPoints,
                    },
                },
            }),
        ]);
        return { success: true, pointsAwarded: task.rewardPoints };
    }
    async getUserScore(walletAddress) {
        console.log("getUserScore called for:", walletAddress);
        let user = await this.prisma.user.findUnique({
            where: { walletAddress },
            select: {
                id: true,
                score: true,
                userTasks: {
                    where: { verified: true },
                    include: { task: true },
                },
            },
        });
        console.log("Found user:", user?.id, "tasks:", user?.userTasks.length);
        if (!user) {
            user = await this.prisma.user.create({
                data: { walletAddress },
                select: {
                    id: true,
                    score: true,
                    userTasks: {
                        where: { verified: true },
                        include: { task: true },
                    },
                },
            });
            console.log("Created new user:", user.id);
        }
        return {
            score: user.score,
            completedTasks: user.userTasks.length,
            tasks: user.userTasks,
        };
    }
    async getLeaderboard(limit = 10) {
        return this.prisma.user.findMany({
            orderBy: { score: "desc" },
            take: limit,
            select: {
                walletAddress: true,
                score: true,
                _count: {
                    select: { userTasks: true },
                },
            },
        });
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TasksService);
//# sourceMappingURL=tasks.service.js.map