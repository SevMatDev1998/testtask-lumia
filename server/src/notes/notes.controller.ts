import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from "@nestjs/common";
import { NotesService } from "./notes.service";
import { CreateNoteDto } from "./dto/create-note.dto";
import { UpdateNoteDto } from "./dto/update-note.dto";
import { AuthGuard } from "./guards/auth.guard";
import { User } from "./decorators/user.decorator";

@Controller("api/notes")
@UseGuards(AuthGuard)
export class NotesController {
  constructor(private notesService: NotesService) {}

  @Get()
  findAll(@User("userId") userId: string) {
    return this.notesService.findAll(userId);
  }

  @Get(":id")
  findOne(@Param("id") id: string, @User("userId") userId: string) {
    return this.notesService.findOne(id, userId);
  }

  @Post()
  create(@User("userId") userId: string, @Body() dto: CreateNoteDto) {
    return this.notesService.create(userId, dto);
  }

  @Put(":id")
  update(
    @Param("id") id: string,
    @User("userId") userId: string,
    @Body() dto: UpdateNoteDto,
  ) {
    return this.notesService.update(id, userId, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string, @User("userId") userId: string) {
    return this.notesService.remove(id, userId);
  }
}
