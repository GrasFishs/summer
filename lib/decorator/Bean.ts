import BeanFactory from '../factory/bean';
export function AutoWired(target, name) {
  const val = BeanFactory.get(name);
  Object.defineProperty(target, name, {
    enumerable: true,
    configurable: true,
    get() {
      return val;
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
