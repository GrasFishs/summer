import { Router, Response, Request } from 'express';

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

class ControllerModel {
  static _type = 'Controller';

  public _routes: Route[] = [];

  public _params: Params = {};

  public _path: string;

  public _router: Router;
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
    this.target._path = path;
    this.target._router = Router();
    if (this.target._routes) {
      this.target._routes.forEach(route => {
        this.setRoute(route);
      });
    }
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
    this.target._router[method](path, (req: Request, res: Response) => {
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
