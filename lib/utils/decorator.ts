export function getDecoratorType(target, _, desc) {
  if (typeof target === 'function') {
    return 'class';
  } else {
    if (typeof desc === 'number') {
      return 'param';
    } else {
      return 'method';
    }
  }
}
