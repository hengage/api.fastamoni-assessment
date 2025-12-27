type Keys<T> = keyof T;

declare type JSONValue =
  | (null | undefined)
  | string
  | number
  | boolean
  | JSONObject
  | Array<JSONValue>;

declare type JSONObject = { [x: string]: JSONValue };

declare type DatabaseLockMode =
  (typeof DATABASE_LOCK_MODES)[keyof typeof DATABASE_LOCK_MODES];

declare type ID = string;
