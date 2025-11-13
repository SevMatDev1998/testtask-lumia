import { TasksService } from "./tasks.service";
import { CreateTaskDto } from "./dto/create-task.dto";
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    create(createTaskDto: CreateTaskDto): Promise<{
        id: string;
        title: string;
        description: string;
        telegramTaskId: string;
        rewardPoints: number;
        createdAt: Date;
    }>;
    findAll(): Promise<{
        id: string;
        title: string;
        description: string;
        telegramTaskId: string;
        rewardPoints: number;
        createdAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        title: string;
        description: string;
        telegramTaskId: string;
        rewardPoints: number;
        createdAt: Date;
    }>;
    getUserTasks(req: any): Promise<({
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
    verifyTask(id: string, req: any): Promise<{
        success: boolean;
        pointsAwarded: number;
    }>;
    getUserScore(req: any): Promise<{
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
    getLeaderboard(): Promise<{
        walletAddress: string;
        score: number;
        _count: {
            userTasks: number;
        };
    }[]>;
}
