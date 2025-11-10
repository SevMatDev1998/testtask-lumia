import { Controller, Post, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { VerifySessionDto } from "./dto/verify-session.dto";

@Controller("api/auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("verify-session")
  async verifySession(@Body() dto: VerifySessionDto) {
    return this.authService.verifySessionToken(dto.sessionToken);
  }
}
