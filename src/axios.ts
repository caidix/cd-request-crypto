import axios from "axios";
import encrypto from "./crypto";
import { AxiosCryptoOptions, CryptoOptions } from "./types";
import { getURLParameters } from "./utils";

function AxiosCrypto(opt: AxiosCryptoOptions) {
  // 全局拦截
  axios.interceptors.request.use(function (config: AnyRecord = {}) {
    const {
      headers = {},
      params = {},
      url,
      data = {},
      whiteParams = [],
    } = config;
    const method = (config.method || "get").toLowerCase();
    const now = +new Date();
    const baseOptions =
      method === "get"
        ? {
            ...getURLParameters(url),
            ...params,
          }
        : data;
    baseOptions.__timestamp__ = now;

    const { options, sign } = encrypto({
      ...opt,
      options: baseOptions,
      whiteParams,
    });

    delete options.__timestamp__;

    config.headers = {
      ...headers,
      "R-Auth-Sign": sign,
      "R-Timestamp": now,
    };
    if (method === "get") {
      config.params = options;
    } else {
      config.data = options;
    }

    return config;
  });
}
