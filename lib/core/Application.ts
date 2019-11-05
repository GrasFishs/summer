import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as fs from 'fs';
import * as path from 'path';
import BeanFactory from '../factory/bean';

let app: express.Express;

function getAllFiles(pkg, type, files = [], config = {}) {
  if (fs.existsSync(pkg)) {
    fs.readdirSync(pkg).forEach(f => {
      const p = path.join(pkg, f);
      if (fs.statSync(p).isDirectory()) {
        getAllFiles(pkg, type, files);
      } else {
        const mod = require(p);
        if (type === '') {
          config = {
            ...config,
            ...mod
          };
        } else if (mod.default._type === type) {
          const Class = mod.default;
          const matcher = Class.toString().match(/function (.*?)\(/)[1];
          const name = matcher[0].toLowerCase() + matcher.slice(1);
          const instance = new Class();
          BeanFactory.add(name, instance);
          files.push({ name, instance });
        }
      }
    });
  }
  if (type === '') {
    BeanFactory.add('config', config);
  }
  return files;
}

function addConfiguration(pkg) {
  getAllFiles(pkg, '');
}

function addRepository(app, pkg) {
  getAllFiles(pkg, 'Repository');
}

function addService(app, pkg) {
  getAllFiles(pkg, 'Service');
}

function addControllers(app, pkg) {
  getAllFiles(pkg, 'Controller').forEach(({ instance }) => {
    if (instance._router) {
      app.use(instance._path, instance._router);
    }
  });
}

export default class Application {
  static run(
    { configPackage, repositoryPackage, servicePackage, controllerPackage } = {
      controllerPackage: path.join(process.cwd(), 'src', 'controller'),
      repositoryPackage: path.join(process.cwd(), 'src', 'repository'),
      servicePackage: path.join(process.cwd(), 'src', 'service'),
      configPackage: path.join(process.cwd(), 'res')
    }
  ) {
    app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    BeanFactory.add('app', app);
    addConfiguration(configPackage);
    addRepository(app, repositoryPackage);
    addService(app, servicePackage);
    addControllers(app, controllerPackage);
    return new Promise(resolve => {
      app.listen(BeanFactory.get('config').port, resolve);
    });
  }
}
