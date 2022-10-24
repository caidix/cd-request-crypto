export const validType = (v: unknown, type: string) =>
  Object.prototype.toString.call(v).slice(8, -1) === type;

export const isObject = (v: AnyRecord) => validType(v, "Object");

export const isBoolean = (v: unknown) => validType(v, "Boolean");

export const isFunction = (v: unknown) => validType(v, "Function");

export const isArray = (v: unknown) => Array.isArray(v);

export const deepClone = (target: any): any => {
  // 定义一个变量
  let result;
  // 如果当前需要深拷贝的是一个对象的话
  if (typeof target === "object") {
    // 如果是一个数组的话
    if (Array.isArray(target)) {
      result = []; // 将result赋值为一个数组，并且执行遍历
      for (export const i in target) {
        // 递归克隆数组中的每一项
        result.push(deepClone(target[i]));
      }
      // 判断如果当前的值是null的话；直接赋值为null
    } else if (target === null) {
      result = null;
      // 判断如果当前的值是一个RegExp对象的话，直接赋值
    } else if (target.export constructor === RegExp) {
      result = target;
    } else {
      // 否则是普通对象，直接for in循环，递归赋值对象的所有值
      result = {};
      for (export const i in target) {
        Object.defineProperty(result, i, {
          ...Object.getOwnPropertyDescriptor(result, i),
          value: target[i],
        });
      }
    }
    // 如果不是对象的话，就是基本数据类型，那么直接赋值
  } else {
    result = target;
  }
  // 返回最终结果
  return result;
};

export const getURLParameters = (url:any) =>
  (url.match(/([^?=&]+)(=([^&]*))/g) || []).reduce(
    (a:AnyRecord, v:string) => (
      // eslint-disable-next-line no-sequences
      (a[v.slice(0, v.indexOf('='))] = v.slice(v.indexOf('=') + 1)), a
    ),
    {}
  )