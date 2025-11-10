import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import * as jwt from "jsonwebtoken";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async verifySessionToken(sessionToken: string) {
    try {
      const decoded = jwt.decode(sessionToken) as any;

      if (!decoded || !decoded.userId) {
        throw new UnauthorizedException("Invalid session");
      }

      const walletAddress = decoded.userId.toLowerCase();

      let user = await this.prisma.user.findUnique({
        where: { walletAddress },
      });

      if (!user) {
        user = await this.prisma.user.create({
          data: { walletAddress },
        });
      }

      return {
        userId: user.id,
        walletAddress: user.walletAddress,
        session: decoded,
      };
    } catch {
      throw new UnauthorizedException("Session verification failed");
    }
  }
}
