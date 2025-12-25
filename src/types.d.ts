type Keys<T> = keyof T;

declare type JSONValue =
  | (null | undefined)
  | string
  | number
  | boolean
  | JSONObject
  | Array<JSONValue>;

declare type JSONObject = { [x: string]: JSONValue };
