export interface CreateIdempotencyKey {
  key: string;
  requestPath: string;
  userId: ID;
  response: JSONValue;
}
