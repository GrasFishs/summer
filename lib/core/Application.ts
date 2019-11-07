import * as express from 'express';
import * as bodyParser from 'body-parser';
import { join } from 'path';
import { getAllFiles } from '../utils/files';
import { MiddlewareCallback, IMiddleware } from './Middleware';
import { ConfigurationHandler } from './Configuration';

type PackagePath = {
  configPackage: string;
  controllerPackage: string;
  repositoryPackage: string;
  servicePackage: string;
};

const rootPath = process.cwd();

const pkgPaths: PackagePath = {
  configPackage: join(rootPath, 'res'),
  controllerPackage: join(rootPath, 'src', 'controller'),
  repositoryPackage: join(rootPath, 'src', 'repository'),
  servicePackage: join(rootPath, 'src', 'service')
};

export class BeanFactory {
  static beans = new Map();

  static get(name) {
    return this.beans.get(name);
  }

  static release(name) {
    this.beans.delete(name);
  }

  static add(name, bean) {
    this.beans.set(name, bean);
  }
}

export class Application {
  private app: express.Express;
  private pkg: PackagePath;

  private init(instance, pkg) {
    this.app = instance;
    this.pkg = pkg;
    this.addConfiguration(pkg.configPackage);
    this.addRepository(this.pkg.repositoryPackage);
    this.addService(this.pkg.servicePackage);
  }

  public static create(
    instance = express(),
    {
      configPackage = pkgPaths.configPackage,
      controllerPackage = pkgPaths.controllerPackage,
      repositoryPackage = pkgPaths.repositoryPackage,
      servicePackage = pkgPaths.servicePackage
    } = pkgPaths
  ) {
    const pkg = {
      configPackage,
      controllerPackage,
      repositoryPackage,
      servicePackage
    };
    const app = new Application();
    app.init(instance, pkg);
    return app;
  }

  public listen(port, cb) {
    BeanFactory.add('app', this.app);
    this.addControllers(this.pkg.controllerPackage);
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.listen(port, cb);
  }

  public use(cb: MiddlewareCallback | IMiddleware) {
    if (typeof cb === 'function') {
      this.app.use(cb);
    } else {
      this.app.use(cb.resolve());
    }
  }

  private addConfiguration(pkg) {
    console.log('[开始加载] 配置层');
    const configs = getAllFiles(pkg, 'Configuration');
    const { env } = ConfigurationHandler.parse(configs);
    console.log('[加载完毕] 成功加载配置层', '当前环境' + (env ? env : '默认'));
  }

  private addService(pkg) {
    console.log('[开始加载] 服务层');
    const services = getAllFiles(pkg, 'Service');
    console.log('[加载完毕] 成功加载' + services.length + '个服务器');
  }

  private addRepository(pkg) {
    console.log('[开始加载] 数据访问层');
    const repositories = getAllFiles(pkg, 'Repository');
    console.log('[加载完毕] 成功加载' + repositories.length + '个数据访问器');
  }

  private addControllers(pkg) {
    console.log('[开始加载] 控制层');
    const controllers = getAllFiles(pkg, 'Controller');
    controllers.forEach(({ instance }) => {
      if (instance._router) {
        instance.addRoutes();
        this.app.use(instance._path, instance._router);
      }
    });
    console.log('[加载完毕] 成功加载' + controllers.length + '个控制器');
  }
}
