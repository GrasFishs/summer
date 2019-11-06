import * as express from 'express';
import * as bodyParser from 'body-parser';
import { join } from 'path';
import { getAllFiles } from '../utils/files';
import BeanFactory from '../factory/bean';
import { MiddlewareCallback, IMiddleware } from './Middleware';

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

export default class Application {
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
    getAllFiles(pkg, 'Configuration');
  }

  private addService(pkg) {
    getAllFiles(pkg, 'Service');
  }

  private addRepository(pkg) {
    getAllFiles(pkg, 'Repository');
  }

  private addControllers(pkg) {
    getAllFiles(pkg, 'Controller').forEach(({ instance }) => {
      if (instance._router) {
        instance.addRoutes();
        this.app.use(instance._path, instance._router);
      }
    });
  }
}
