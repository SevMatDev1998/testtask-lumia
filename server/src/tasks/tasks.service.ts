import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TelegramVerifier } from "tasks-verifiers";

@Injectable()
export class TasksService {
  private telegramVerifier: TelegramVerifier;

  constructor(private prisma: PrismaService) {
    this.telegramVerifier = new TelegramVerifier(process.env.TELEGRAM_BOT_TOKEN || '');
  }

  async createTask(createTaskDto: CreateTaskDto) {
    return this.prisma.task.create({
      data: createTaskDto,
    });
  }

  async getAllTasks() {
    const tasks = await this.prisma.task.findMany({
      orderBy: { createdAt: "desc" },
    });
    return tasks;
  }

  async getTask(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });
    if (!task) throw new NotFoundException("Task not found");
    return task;
  }

  async getUserTasks(userId: string) {
    return this.prisma.userTask.findMany({
      where: { userId },
      include: { task: true },
    });
  }

  async verifyTaskCompletion(taskId: string, walletAddress: string) {
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
      throw new BadRequestException("Task already completed");
    }

    let isVerified = false;

    if (
      !process.env.TELEGRAM_BOT_TOKEN ||
      process.env.TELEGRAM_BOT_TOKEN.startsWith("test") ||
      process.env.TELEGRAM_BOT_TOKEN === "demo"
    ) {
      isVerified = true;
    } else {
      isVerified = await this.telegramVerifier.verify(
        walletAddress,
        task.telegramTaskId,
      );
    }

    if (!isVerified) {
      throw new BadRequestException("Task verification failed");
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

  async getUserScore(walletAddress: string) {
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
    }

    return {
      score: user.score,
      completedTasks: user.userTasks.length,
      tasks: user.userTasks,
    };
  }

  async getLeaderboard(limit: number = 10) {
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
}
