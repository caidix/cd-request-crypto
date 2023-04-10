import { isBoolean, isFunction, isObject } from "./index";

type Compare = (a: string, b: string) => number;
interface SortOptions {
  deep: boolean;
  compare?: Compare;
}

const _compare: Compare = (n, m) => {
  var a = n.toLowerCase();
  var b = m.toLowerCase();
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
};

export function sortByKey(data: AnyRecord, options: SortOptions) {
  const { deep = true, compare = _compare } = options;

  if (!isBoolean(deep)) {
    throw TypeError("Sort Params Error: deep must be Boolean type");
  }

  if (!isFunction(compare)) {
    throw TypeError("Sort Params Error: compare must be Function type");
  }

  // 深度递归时存储历史地址 -- 防止循环引用造成死锁
  const inputRecord: AnyRecord[] = [];
  const ouputRecord: AnyRecord[] = [];

  const sortByArray = (data: any[]) => {
    const recordIndex = inputRecord.indexOf(data);
    if (recordIndex > -1) {
      return ouputRecord[recordIndex];
    }

    const res: any[] = [];
    inputRecord.push(data);
    ouputRecord.push(res);

    res.push(
      ...data.map((item) => {
        if (Array.isArray(item)) {
          return sortByArray(item);
        }
        if (isObject(item)) {
          return sort(item);
        }
        return item;
      })
    );

    return res;
  };

  const sort = (data: AnyRecord): AnyRecord => {
    const recordIndex = inputRecord.indexOf(data);
    if (recordIndex > -1) {
      return ouputRecord[recordIndex];
    }

    const sortParams = {};
    const sortKeys = Object.keys(data).sort(compare);

    inputRecord.push(data);
    ouputRecord.push(sortParams);

    sortKeys.forEach((key) => {
      let value: any = data[key];
      if (deep) {
        if (Array.isArray(value)) {
          value = sortByArray(value);
        }
        if (isObject(value)) {
          value = sort(value);
        }
      }
      Object.defineProperty(sortParams, key, {
        ...Object.getOwnPropertyDescriptor(sortParams, key),
        value,
      });
    });

    return sortParams;
  };

  return sort(data);
}
