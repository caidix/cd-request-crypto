export const validType = (v: unknown, type: string) =>
  Object.prototype.toString.call(v).slice(8, -1) === type;

export const isObject = (v: AnyRecord) => validType(v, "Object");

export const isBoolean = (v: unknown) => validType(v, "Boolean");

export const isFunction = (v: unknown) => validType(v, "Function");

export const isArray = (v: unknown) => Array.isArray(v);

export const getURLParameters = (url: any) =>
  (url.match(/([^?=&]+)(=([^&]*))/g) || []).reduce(
    (a: AnyRecord, v: string) => (
      // eslint-disable-next-line no-sequences
      (a[v.slice(0, v.indexOf("="))] = v.slice(v.indexOf("=") + 1)), a
    ),
    {}
  );
