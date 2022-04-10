import { createParamDecorator, ExecutionContext } from '@nestjs/common';

type Optional<T> = T | undefined;

export const AuthUser = createParamDecorator(
  (data: Optional<string>, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    if (data) return request.user[data];

    return request.user;
  }
);
