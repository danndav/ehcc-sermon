import { Request, Response, NextFunction } from 'express';
import { UnauthorizedException } from '@nestjs/common';
import jwt from 'jsonwebtoken';

export const checkAuthenticationToken = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new UnauthorizedException('Unauthorized'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';
    const decodedToken = jwt.verify(token, SECRET_KEY) as any;
    response.locals.decodedToken = decodedToken;
    // Set user for context middlewares (they read response.locals.user)
    response.locals.user = {
      id: decodedToken.sub,
      eaNumber: decodedToken.eaNumber,
      email: decodedToken.email,
      role: decodedToken.role,
    };
    // Set on request for auth guard and roles guard
    (request as any).currentUser = decodedToken;
    next();
  } catch (error) {
    return next(new UnauthorizedException('Invalid Token'));
  }
}