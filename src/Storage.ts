import { LS } from './LS';

/**
 * Generic Storage functionality that is perfectly suitable for creating a
 * well-typed wrapper around particular entry in the storage (by default localStorage).
 * It only make sense to use it with complex objects. For primitives, you can use basic `LS` or similar
 *
 * @example
 * const storage = new Storage<User>('user_key');
 * storage.write({ name: 'John' });
 */
export class Storage<T = object> {
  /**
   * @param key Key to be used for storing the data
   * @param driver Where data will be stored @default LS. You can choose from `LS`, `SS`, `AdvancedLS` or your own implementation
   */
  constructor(private key: string, private driver = LS) {}

  /**
   * Writes object in the storage
   *
   * @param {T} value
   */
  write(value: T) {
    this.driver.write(this.key, value);
  }

  /**
   * Reads whole object from the storage
   */
  read(defaultValue: any = undefined): T | undefined {
    return this.driver.read<T>(this.key, defaultValue);
  }

  /**
   * Updates parts of the object (using shallow merge) in the storage.
   * If there is no existing value, it will just create a new one.
   *
   * @param {object} value
   */
  update(value: Partial<T>) {
    this.driver.update<T>(this.key, value);
  }

  /**
   * Remove item from the storage
   */
  remove() {
    this.driver.remove(this.key);
  }
}
