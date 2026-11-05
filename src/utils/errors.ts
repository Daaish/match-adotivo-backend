export class AppError extends Error {
  constructor(message: string, public readonly statusCode: number) { super(message); }
}
export class NotFoundError extends AppError {
  constructor(message = "Registro não encontrado") { super(message, 404); }
}
export class ConflictError extends AppError {
  constructor(message = "Registro duplicado") { super(message, 409); }
}
export class UnauthorizedError extends AppError {
  constructor(message = "Não autorizado") { super(message, 401); }
}
