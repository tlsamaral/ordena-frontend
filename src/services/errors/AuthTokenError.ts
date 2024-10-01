export class AuthTokenError extends Error {
  constructor() {
    super('Invalid or expired authentication token')
  }
}
