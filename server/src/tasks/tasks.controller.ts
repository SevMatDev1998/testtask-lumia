import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { VerifyTaskDto } from "./dto/verify-task.dto";
import { AuthGuard } from "../notes/guards/auth.guard";

@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.createTask(createTaskDto);
  }

  @Get()
  findAll() {
    return this.tasksService.getAllTasks();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.tasksService.getTask(id);
  }

  @UseGuards(AuthGuard)
  @Get("user/my-tasks")
  getUserTasks(@Request() req) {
    return this.tasksService.getUserTasks(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Post(":id/verify")
  verifyTask(@Param("id") id: string, @Request() req) {
    return this.tasksService.verifyTaskCompletion(id, req.user.walletAddress);
  }

  @UseGuards(AuthGuard)
  @Get("user/score")
  getUserScore(@Request() req) {
    return this.tasksService.getUserScore(req.user.walletAddress);
  }

  @Get("leaderboard/top")
  getLeaderboard() {
    return this.tasksService.getLeaderboard();
  }
}
