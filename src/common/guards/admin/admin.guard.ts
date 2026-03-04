import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User, UserRole } from 'src/auth/user.interface';
import { IS_ADMIN_KEY } from 'src/common/decorators/admin.decorator';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiresAdmin = this.reflector.getAllAndOverride<boolean>(IS_ADMIN_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiresAdmin) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const user = (request as any).user as User;


    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('This action requires administrator privileges.');
    }
    return true;
  }
}