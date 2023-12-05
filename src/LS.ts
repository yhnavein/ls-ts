function isString(x: any) {
  return Object.prototype.toString.call(x) === '[object String]';
}

/**
 * Local Storage Wrapper. Will persist contents forever. It's as simple as it gets.
 **/
export const LS = {
  /**
   * Read a typed item from the local storage
   *
   * @template T
   * @param {string} key
   * @param {any} defaultValue Value to be returned when localStorage does not contain requested key
   * @returns {T} item or undefined
   */
  read<T>(key: string, defaultValue: any = undefined): T | undefined {
    const value = localStorage.getItem(key);

    if (!value) {
      return defaultValue;
    }

    try {
      const item = JSON.parse(value);
      return item as T;
    } catch (error) {
      // This handles the case when we have a string value in local storage
      return value ?? defaultValue;
    }
  },

  /**
   * Write complex object or string to the local storage
   *
   * @param {string} key
   * @param {any} value
   */
  write(key: string, value: any) {
    const text = isString(value) ? value : JSON.stringify(value);
    try {
      localStorage.setItem(key, text);
    } catch (err) {
      if (err.name === 'NS_ERROR_FILE_CORRUPTED') {
        localStorage.clear();
      }
    }
  },

  /**
   * Updates a complex value (using shallow merge) in the local storage.
   * If there is no existing value, it will just create a new one.
   * Only object types are supported
   *
   * @param {string} key
   * @param {object} value
   */
  update<T = object>(key: string, value: Partial<T>) {
    if (!value || typeof value !== 'object') {
      throw new Error('Not supported value type. Only objects are supported.');
    }

    const oldVal = this.read(key);

    if (oldVal && typeof oldVal !== 'object') {
      throw new Error("We can't merge a primitive type with an object. Clear previous value first");
    }
    const newVal = oldVal ?? {};
    Object.assign(newVal, value);
    this.write(key, newVal);
  },

  /**
   * Remove selected item from the local storage
   *
   * @param {string} key
   */
  remove(key: string) {
    localStorage.removeItem(key);
  },
};
