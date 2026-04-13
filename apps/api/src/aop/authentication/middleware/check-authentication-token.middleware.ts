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
    next(new UnauthorizedException('Unauthorized'));
  }

  const token = authHeader?.split(' ')[1];

  try {
    const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';
    const decodedToken = jwt.verify(token!, SECRET_KEY);
    response.locals.decodedToken = decodedToken;
    next();
  } catch (error) {
    next(new UnauthorizedException('Invalid Token'));
  }
}