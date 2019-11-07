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

export function getClassName(Class): string {
  return Class.toString().match(/class (.*?)\s?{/)[1]
}