import * as fs from 'fs';
import * as path from 'path';
import { BeanFactory } from '../core/Application';
import { getClassName } from './decorator';

export function getAllFiles(pkg, type, files = []) {
  if (fs.existsSync(pkg)) {
    fs.readdirSync(pkg).forEach(f => {
      const p = path.join(pkg, f);
      if (fs.statSync(p).isDirectory()) {
        getAllFiles(pkg, type, files);
      } else {
        if (path.extname(f) !== '.ts') {
          files.push(p);
        } else {
          const Class = require(p).default;
          if (Class._type === type) {
            const matcher = getClassName(Class);
            const name = matcher[0].toLowerCase() + matcher.slice(1);
            const instance = new Class();
            BeanFactory.add(name, instance);
            files.push({ name, instance });
          }
        }
      }
    });
  }
  return files;
}
