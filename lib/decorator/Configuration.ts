import { BeanFactory } from '../core/Application';

const TYPE = 'Configuration';

export function Configuration(target) {
  target.prototype._type = TYPE;
}

export function bean(target, name, descriptor) {
  if (target._type === TYPE) {
    BeanFactory.add(name, descriptor.value());
  }
}
