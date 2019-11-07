import * as path from 'path';
import * as fs from 'fs';
import * as YAML from 'yaml';
import merge = require('lodash.merge');
import { BeanFactory } from './Application';

const defaultConfiguration = {
  server: {
    port: 3000
  }
};

// yaml优先
export class ConfigurationHandler {
  public static default = 'application';

  public static parse(files: string[]) {
    const defaultConfig = this.getDefaultConfig(files);
    const env = defaultConfig.env || process.env.NODE_ENV || '';
    const envConfig = env ? this.getConfig(files, '.' + env) : {};
    if (envConfig.env) {
      delete envConfig.env;
    }
    let config = env ? merge({}, defaultConfig, envConfig) : defaultConfig;
    BeanFactory.add('config', config);
    return {
      env,
      config
    };
  }
  private static getDefaultConfig(files: string[]) {
    return merge({}, defaultConfiguration, this.getConfig(files, ''));
  }

  private static getConfig(files: string[], suffix: string) {
    const json = files.find(
      f => f.split(path.sep).pop() === `${this.default}${suffix}.json`
    );
    const yaml = files.find(
      f => f.split(path.sep).pop() === `${this.default}${suffix}.yaml`
    );
    if (json && yaml) {
      return merge(require(json), YAML.parse(fs.readFileSync(yaml, 'utf-8')));
    } else if (json && !yaml) {
      return require(json);
    } else if (!json && yaml) {
      return YAML.parse(fs.readFileSync(yaml, 'utf-8'));
    } else {
      throw new ReferenceError(
        `${this.default}${suffix}.json或${this.default}${suffix}.yaml未找到.请至少配置其中一项`
      );
    }
  }
}
