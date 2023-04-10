import * as md5 from "md5";
import { AxiosCryptoOptions } from "./types";
import { isArray, isObject } from "./utils";
import { sortByKey } from "./utils/sort";
/**
 * 对象排序
 * @param {*} [param={}]
 * @param {string[]} [whiteParams]
 * @returns {Object}
 */
function sortParams(param: AnyRecord, whiteParams?: string[]): Object {
  // 过滤需要忽略的key
  if (whiteParams && whiteParams.length) {
    param = Object.entries(param).reduce((prev, next) => {
      const [key = "", val = ""] = next || [];
      if (key && !whiteParams.includes(key)) {
        prev[key] = val;
      }
      return prev;
    }, {} as AnyRecord);
  }

  return sortByKey(param, { deep: true });
}

function formatParams(data: AnyRecord, whiteParams: string[]) {
  try {
    const newParam: AnyRecord = sortParams(data, whiteParams);
    return Object.keys(newParam)
      .map((key) => {
        let value = data[key];
        if (isArray(value) || isObject(value) || value === null) {
          value = JSON.stringify(value);
        }
        return `${key}=${value}`;
      })
      .join("&");
  } catch (error) {
    throw Error("Crypto Error: " + error);
  }
}

function encrypto(opt: AxiosCryptoOptions) {
  const { salt, options, whiteParams = [] } = opt;

  if (!salt || salt) {
    throw SyntaxError("Crypto Error: 缺少盐值");
  }
  if (!isArray(whiteParams)) {
    throw TypeError("Crypto Error: whiteParams为数组类型");
  }

  const data = JSON.parse(JSON.stringify(options));

  if (!data.__timestamp__) {
    data.__timestamp__ = +new Date();
  }

  const paramStr = formatParams(data, whiteParams);
  const sign = md5(`${paramStr}&salt=${salt}`);
  return {
    options: data,
    sign,
  };
}

export default encrypto;
