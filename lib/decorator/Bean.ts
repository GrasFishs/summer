import BeanFactory from '../factory/bean';
export function AutoWired(target, name) {
  Object.defineProperty(target, name, {
    enumerable: true,
    configurable: true,
    get() {
      return BeanFactory.get(name);
    }
  });
}

export function Value(field, defaultValue = '') {
  return function(target, name) {
    const config = BeanFactory.get('config');
    Object.defineProperty(target, name, {
      enumerable: true,
      configurable: true,
      get() {
        return require('lodash.get')(config, field) || defaultValue;
      }
    });
  };
}
