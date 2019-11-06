import { Router, Response, Request } from 'express';
import { IMiddleware, MiddlewareCallback } from './Middleware';
import { getDecoratorType } from '../utils/decorator';

type Route = {
  method: string;
  path: string;
  name: string;
  callback: Function;
};

type Param = {
  index: number;
  arg: any;
  type: string;
};

type Params = {
  [method: string]: Param[];
};

type MiddlewareModel = {
  type: 'class' | 'method' | 'param';
  name: string;
  middleware: MiddlewareCallback;
};

class ControllerModel {
  static _type = 'Controller';

  public _routes: Route[];

  public _params: Params;

  public _middleware: MiddlewareModel[];

  public _path: string;

  public _router: Router;

  public addRoutes: () => void;
}

export default class ControllerHandler {
  static target: ControllerModel;

  public static addComponent(type, callback?) {
    return target => {
      target._type = type;
      if (callback) {
        callback(target);
      }
    };
  }

  public static addController() {
    return (path: string) =>
      this.addComponent('Controller', target => {
        this.setController(target.prototype, path);
      });
  }

  private static setController(target: ControllerModel, path: string) {
    this.target = target;
    target._path = path;
    target._router = Router();
    target.addRoutes = () => {
      if (target._routes) {
        target._routes.forEach(route => {
          this.setRoute(route);
        });
      }
    };
  }

  public static addMiddleware() {
    return Middleware => (target, ...args) => {
      const proto = target.prototype;
      const type = getDecoratorType(target, args[0], args[1]);
      if (Middleware && typeof Middleware === 'function') {
        const middleware = new Middleware();
        if (middleware.resolve) {
          const model: MiddlewareModel = {
            type,
            name: args[0],
            middleware: middleware.resolve()
          };
          if (proto._middleware) {
            proto._middleware.push(model);
          } else {
            proto._middleware = [model];
          }
        }
      }
    };
  }

  public static addRouteMethod(reqMethod) {
    return (path: string) => (target, name: string, descriptor) => {
      const route: Route = {
        path,
        name,
        method: reqMethod,
        callback: descriptor.value
      };
      if (target._routes) {
        target._routes.push(route);
      } else {
        target._routes = [route];
      }
    };
  }

  public static addArgument(type: string) {
    return (arg?: any) => (target, name: string, index: number) => {
      const param: Param = {
        type,
        index,
        arg
      };
      if (target._params) {
        if (name in target._params) {
          target._params[name].push(param);
        } else {
          target._params[name] = [param];
        }
      } else {
        target._params = {
          [name]: [param]
        };
      }
    };
  }

  private static setRoute({ method, path, name, callback }: Route) {
    const mws: MiddlewareCallback[] = [];
    const middleware = this.target._middleware;
    if (middleware) {
      const classMiddleware = middleware.find(m => m.type === 'class');
      const methodMiddleware = middleware.find(m => m.name === name);
      if (classMiddleware) mws[0] = classMiddleware.middleware;
      if (methodMiddleware) mws.push(methodMiddleware.middleware);
    }
    this.target._router[method](path, ...mws, (req: Request, res: Response) => {
      const result = callback.apply(this.target, this.getArgs(req, res, name));
      this.handleCallback(res, result);
    });
  }

  private static getArgs(req: Request, res: Response, methodName: string) {
    const args: any[] = [req, res];
    if ('_params' in this.target) {
      const params = this.target._params[methodName];
      if (params) {
        params.forEach(({ type, index, arg }) => {
          if (type !== 'req' && type !== 'res') {
            args[index] = arg ? req[type][arg] : req[type];
          } else {
            args[index] = type === 'req' ? req : res;
          }
        });
      }
    }
    return args;
  }

  private static handleCallback(res: Response, result: any) {
    if (result !== undefined) {
      if (result instanceof Promise) {
        result.then(res.json);
      } else {
        res.json(result);
      }
    }
  }
}
