# Summer.js

### 基于`express`与`typescript`的模仿`nest.js`的`nodejs`后端框架

# 第一期实现目标

- [x] Controller
- [x] Middleware
- [x] Configuration
- [ ] DI
- [ ] AOP
- [ ] Exception

# 日志记录

## 2019.11.8  
完成`Configuration`功能。
默认文件格式为`.json`和`.yaml`。同名配置`.yaml`优先（即`yaml`会覆盖与`json`相同的字段)。默认文件名为`application`可以配置。目前只支持全局配置。后续可能会开发组件配置和动态配置。

## 2019.11.7
完成基本框架的结构，包括主要功能以及装饰器的开发。该框架主要围绕`Controller`进行，包括相对应的中间件等等。  
`@Controller`相当于一个主路由，被装饰的类下的所有加上请求装饰器的方法都在该路由下进行调用。请求装饰器包括`@Get`，`@Post`，`@Put`，`@Delete`四个方法，参数遵循`express`规范。请求参数装饰器包括`@Req`，`@Res`，`@Next`，`@Header`，`@Query`，`@Param`，`@Body`。  
`@Middleware`既可以定义中间件，也可以装饰在类或请求方法上。若装饰在类上，则相对于整个路由都使用该中间件；否则只是被装饰的请求方法使用该中间件。
