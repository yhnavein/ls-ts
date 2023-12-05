/**
 * Local Storage Wrapper. Will persist contents for a given time. You can add expiry time and/or token.
 * Token can be bound for example to the app version. When it changes then it invalidates data
 **/
export const AdvancedLS = {
  /**
   * Read a typed object from the local storage
   *
   * @template T
   * @param {string} key
   * @param opts
   * @param {any} defaultValue Value to be returned when localStorage does not contain requested key
   * @returns {T} item or undefined
   */
  read<T>(key: string, opts?: ReadOptions, defaultValue: any = undefined): T | undefined {
    const value = localStorage.getItem(key);

    if (!value) {
      return defaultValue;
    }

    try {
      const item = JSON.parse(value) as LsValue;

      if (item && !!item.value) {
        if (!!item.expiry && new Date().getTime() > item.expiry) {
          localStorage.removeItem(key);
          return defaultValue;
        }

        if ((item.token || opts?.cacheToken) && item.token !== opts?.cacheToken) {
          localStorage.removeItem(key);
          return defaultValue;
        }

        return item.value as T;
      }
      return defaultValue;
    } catch (error) {
      // This handles the case when we have a string value in local storage
      return value ?? defaultValue;
    }
  },

  /**
   * Write an object or string to the local storage
   *
   * @param {string} key
   * @param {any} value
   * @param {string} opts Options defining how long this data can live
   */
  write(key: string, value: any, opts?: WriteOptions) {
    const val: LsValue = { value };

    if (opts?.ttl) {
      val.expiry = new Date().getTime() + opts.ttl * 1000;
    }

    if (opts?.cacheToken) {
      val.token = opts.cacheToken;
    }

    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (err) {
      if (err.name === 'NS_ERROR_FILE_CORRUPTED') {
        localStorage.clear();
      }
    }
  },

  /**
   * Updates a complex value (using shallow merge) in the local storage.
   * If there is no existing value (or it expired), it will just create a new one.
   * Only object types are supported
   *
   * @param {string} key
   * @param {object} value
   * @param opts Options defining how long this data can live
   */
  update<T = object>(key: string, value: Partial<T>, opts?: WriteOptions) {
    if (!value || typeof value !== 'object') {
      throw new Error('Not supported value type. Only objects are supported.');
    }

    const oldVal = this.read(key, opts);

    if (oldVal && typeof oldVal !== 'object') {
      throw new Error("We can't merge a primitive type with an object. Clear previous value first");
    }
    const newVal = oldVal ?? {};
    Object.assign(newVal, value);
    this.write(key, newVal, opts);
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

interface WriteOptions {
  /** defines how long this value can be used (in seconds). Does not work with `string` type */
  ttl?: number;

  /**
   * Optional token saved alongside your value. If you decide to use token when saving it is expected
   * that once reading value, if a given token at that time is different, then item will be invalidated
   **/
  cacheToken?: string | number;
}

interface ReadOptions {
  /**
   * Optional token saved alongside your value. If you decide to use token when saving
   * and once reading value, different value of the token is provided then LS entry will be invalidated
   **/
  cacheToken?: string | number;
}

interface LsValue {
  value: any;
  expiry?: number;
  token?: string | number;
}
