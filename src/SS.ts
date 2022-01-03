function isString(x: any) {
  return Object.prototype.toString.call(x) === '[object String]';
}

/** Session Storage Wrapper. Will persist contents as long as tab is not closed */
export const SS = {
  /**
   * Read a typed object from the session storage
   *
   * @template T
   * @param {string} key
   * @param {any} defaultValue Value to be returned when sessionStorage does not contain requested key
   * @returns {T}
   */
  read<T>(key: string, defaultValue: any = undefined): T {
    const value = sessionStorage.getItem(key);

    if (!value) {
      return defaultValue;
    }

    try {
      return JSON.parse(value) as T;
    } catch (error) {
      return value || defaultValue;
    }
  },

  /**
   * Write complex object or string to the session storage
   *
   * @param {string} key
   * @param {any} value
   */
  write(key: string, value: any) {
    const text = isString(value) ? value : JSON.stringify(value);
    try {
      sessionStorage.setItem(key, text);
    } catch (err) {
      if (err.name === 'NS_ERROR_FILE_CORRUPTED') {
        sessionStorage.clear();
      }
    }
  },

  /**
   * Remove selected item from the session storage
   *
   * @param {string} key
   */
  remove(key: string) {
    sessionStorage.removeItem(key);
  },
};
