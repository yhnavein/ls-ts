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
   * @returns {T}
   */
  read<T>(key: string, opts: ReadOptions, defaultValue: any = undefined): T {
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

        if ((item.token || opts.cacheToken) && item.token !== opts?.cacheToken) {
          localStorage.removeItem(key);
          return defaultValue;
        }

        return item.value as T;
      }
      return defaultValue;
    } catch (error) {
      return value || defaultValue;
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
   * Optional token saved alongside your value. If you decided to use token when saving it is expected
   * that once reading value, if a given token at that time is different, then item will be invalidated
   **/
  cacheToken?: string | number;
}

interface ReadOptions {
  /**
   * Optional token saved alongside your value. If you decided to use token when saving
   * and once reading value, different value of the token is provided then LS entry will be invalidated
   **/
  cacheToken?: string | number;
}

interface LsValue {
  value: any;
  expiry?: number;
  token?: string | number;
}
