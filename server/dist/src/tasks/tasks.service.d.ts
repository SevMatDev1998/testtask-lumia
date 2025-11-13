import { PrismaService } from "../prisma/prisma.service";
import { CreateTaskDto } from "./dto/create-task.dto";
export declare class TasksService {
    private prisma;
    private telegramVerifier;
    constructor(prisma: PrismaService);
    createTask(createTaskDto: CreateTaskDto): Promise<{
        id: string;
        title: string;
        description: string;
        telegramTaskId: string;
        rewardPoints: number;
        createdAt: Date;
    }>;
    getAllTasks(): Promise<{
        id: string;
        title: string;
        description: string;
        telegramTaskId: string;
        rewardPoints: number;
        createdAt: Date;
    }[]>;
    getTask(id: string): Promise<{
        id: string;
        title: string;
        description: string;
        telegramTaskId: string;
        rewardPoints: number;
        createdAt: Date;
    }>;
    getUserTasks(userId: string): Promise<({
        task: {
            id: string;
            title: string;
            description: string;
            telegramTaskId: string;
            rewardPoints: number;
            createdAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        taskId: string;
        verified: boolean;
        completedAt: Date | null;
    })[]>;
    verifyTaskCompletion(taskId: string, walletAddress: string): Promise<{
        success: boolean;
        pointsAwarded: number;
    }>;
    getUserScore(walletAddress: string): Promise<{
        score: number;
        completedTasks: number;
        tasks: ({
            task: {
                id: string;
                title: string;
                description: string;
                telegramTaskId: string;
                rewardPoints: number;
                createdAt: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            taskId: string;
            verified: boolean;
            completedAt: Date | null;
        })[];
    }>;
    getLeaderboard(limit?: number): Promise<{
        walletAddress: string;
        score: number;
        _count: {
            userTasks: number;
        };
    }[]>;
}
