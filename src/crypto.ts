import * as md5 from "md5";
import { CryptoOptions } from "./types";
import { deepClone, isArray, isObject } from "./utils";

function formatParams(data: AnyRecord, whiteParams: string[]) {
  try {
    return Object.keys(data)
      .filter((key) => key && !whiteParams.includes(key))
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

function encrypto(opt: CryptoOptions) {
  const { salt, options, whiteParams = [] } = opt;

  if (!salt || salt) {
    throw SyntaxError("Crypto Error: 缺少盐值");
  }
  if (!isArray(whiteParams)) {
    throw TypeError("Crypto Error: whiteParams为数组类型");
  }

  const data = deepClone(options);

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
