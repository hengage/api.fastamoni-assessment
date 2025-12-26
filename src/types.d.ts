import { DATABASE_LOCK_MODES } from './common/constants';

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
