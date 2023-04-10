# Axios 自用前端请求参数混淆插件

### 使用场景

> * 客户端接口加密，增强应用安全的健壮性。

### 加密规则

> 1. `全局拦截`API请求的参数[GET/POST]，并转换为JSON格式。
> 2. 请求体中附加时间戳参数，参数字段为`_`,值为时间戳。
> 3. 对转换后的请求体JSON进行排序，(此处参考[排序规则](#排序规则))。
> 4. 对排序好的JSON进行字符串拼接，(此处参考[拼接规则](#拼接规则)) 。
> 5. 拼接好的字符串（通过`key=val&`）最后再附加上固定盐值得到最后需要加密的字符串（即`...&key=val&salt`）。
> 6. 使用`MD5`的方式加密最后拼接的字符串，得到加密密钥。

### 排序规则

> 1. 只对对象的key进行排序。
> 2. 进行深度遍历排序。
> 3. 当遇到数组时，检测数组的每项值，若为`对象(Object/Array)`则遍历对象进行递归排序，其他类型不做处理。

### 使用

> 1. 使用插件之后，不会改变原有API参数，会向header头中插入 `R-Auth-Sign`, `R-Timestamp` 两个头信息来进行加密的校验。

自动拦截

```js
import {AxiosCrypto} from '@caidix/cd-request-crypto'

// 在axios配置文件内执行
AxiosCrypto(options...)
```

手动添加

```ts
interface AxiosCryptoOptions {
  salt: string; // 盐值
  options: AnyRecord;
  whiteParams?: string[]; // 入参白名单
}
import Crypto from '@caidix/cd-request-crypto'
// axios拦截器内部

Crypto({
  // ...
} as AxiosCryptoOptions)
```

### 版本规则

npm包的版本号也是有规范要求的，通用的就是遵循semver语义化版本规范，版本格式为：major.minor.patch，每个字母代表的含义如下：

- 主版本号(major)：当你做了不兼容的API修改
- 次版本号(minor)：当你做了向下兼容的功能性新增
- 修订号(patch)：当你做了向下兼容的问题修正

　　1. 先行版本号是加到修订号的后面，作为版本号的延伸；当要发行大版本或核心功能时，但不能保证这个版本完全正常，就要先发一个先行版本。
　　2. 先行版本号的格式是在修订版本号后面加上一个连接号（-），再加上一连串以点（.）分割的标识符，标识符可以由英文、数字和连接号（[0-9A-Za-z-]）组成。例如：
- 1.0​​.0-alpha
- 1.0.0-alpha.1
- 1.0.0-0.3.7

> 常见的先行版本号有：

- alpha：不稳定版本，一般而言，该版本的Bug较多，需要继续修改，是测试版本
- beta：基本稳定，相对于Alpha版已经有了很大的进步，消除了严重错误
- rc：和正式版基本相同，基本上不存在导致错误的Bug
- release：最终版本
