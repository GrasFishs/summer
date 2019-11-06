import * as fs from 'fs';
import * as path from 'path';
import BeanFactory from '../factory/bean';

export function getAllFiles(pkg, type, files = [], config = {}) {
  if (fs.existsSync(pkg)) {
    fs.readdirSync(pkg).forEach(f => {
      const p = path.join(pkg, f);
      if (fs.statSync(p).isDirectory()) {
        getAllFiles(pkg, type, files);
      } else {
        const mod = require(p);
        if (type === 'Configuration') {
          config = {
            ...config,
            ...mod
          };
        } else if (mod.default._type === type) {
          const Class = mod.default;
          const matcher = Class.toString().match(/class (.*?)\s?{/)[1];
          const name = matcher[0].toLowerCase() + matcher.slice(1);
          const instance = new Class();
          BeanFactory.add(name, instance);
          files.push({ name, instance });
        }
      }
    });
  }
  if (type === 'Configuration') {
    BeanFactory.add('config', config);
  }
  return files;
}