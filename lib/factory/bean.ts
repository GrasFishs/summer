export default class BeanFactory {
  static beans = new Map();

  static get(name) {
    return this.beans.get(name);
  }

  static release(name) {
    this.beans.delete(name);
  }

  static add(name, bean) {
    this.beans.set(name, bean);
  }
}
