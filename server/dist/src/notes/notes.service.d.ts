import { PrismaService } from "../prisma/prisma.service";
import { CreateNoteDto } from "./dto/create-note.dto";
import { UpdateNoteDto } from "./dto/update-note.dto";
export declare class NotesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(userId: string): Promise<{
        id: string;
        title: string;
        createdAt: Date;
        content: string;
        userId: string;
        updatedAt: Date;
    }[]>;
    findOne(id: string, userId: string): Promise<{
        id: string;
        title: string;
        createdAt: Date;
        content: string;
        userId: string;
        updatedAt: Date;
    }>;
    create(userId: string, dto: CreateNoteDto): Promise<{
        id: string;
        title: string;
        createdAt: Date;
        content: string;
        userId: string;
        updatedAt: Date;
    }>;
    update(id: string, userId: string, dto: UpdateNoteDto): Promise<{
        id: string;
        title: string;
        createdAt: Date;
        content: string;
        userId: string;
        updatedAt: Date;
    }>;
    remove(id: string, userId: string): Promise<{
        id: string;
        title: string;
        createdAt: Date;
        content: string;
        userId: string;
        updatedAt: Date;
    }>;
}
