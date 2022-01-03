function isString(x: any) {
  return Object.prototype.toString.call(x) === '[object String]';
}

/**
 * Local Storage Wrapper. Will persist contents forever. It's as simple as it gets.
 **/
export const LS = {
  /**
   * Read a typed object from the local storage
   *
   * @template T
   * @param {string} key
   * @param {any} defaultValue Value to be returned when localStorage does not contain requested key
   * @returns {T}
   */
  read<T>(key: string, defaultValue: any = undefined): T {
    const value = localStorage.getItem(key);

    if (!value) {
      return defaultValue;
    }

    try {
      const item = JSON.parse(value);
      return item as T;
    } catch (error) {
      return value || defaultValue;
    }
  },

  /**
   * Write complex object or string to the local storage
   *
   * @param {string} key
   * @param {any} value
   * @param {string} ttl (s) define how long this value can be used. Does not work with `string` type
   */
  write(key: string, value: any) {
    let val = value;
    const text = isString(value) ? value : JSON.stringify(val);
    try {
      localStorage.setItem(key, text);
    } catch (err) {
      if (err.name === 'NS_ERROR_FILE_CORRUPTED') {
        localStorage.clear();
      }
    }
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
