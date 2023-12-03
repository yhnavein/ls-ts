import { expect } from 'chai';
import { AdvancedLS } from './advancedLS';

describe('AdvancedLS', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('write', () => {
    const key = 'TEST2';
    it('should write string value', () => {
      AdvancedLS.write(`${key}1`, 'text');

      const val = localStorage.getItem(`${key}1`);
      expect(val).to.eq('{"value":"text"}');
    });

    it('should write numeric value', () => {
      AdvancedLS.write(`${key}2`, 123);

      const val = localStorage.getItem(`${key}2`);
      expect(val).to.eq('{"value":123}');
    });

    it('should write object value', () => {
      AdvancedLS.write(`${key}3`, { a: 123 });

      const val = localStorage.getItem(`${key}3`);
      expect(val).to.eq('{"value":{"a":123}}');
    });
  });

  describe('read', () => {
    const key = 'TEST3';
    it('should read existing string entry', () => {
      AdvancedLS.write(`${key}1`, 'text');

      const val = AdvancedLS.read(`${key}1`, {});
      expect(val).to.eq('text');
    });

    it('should read existing numeric entry', () => {
      AdvancedLS.write(`${key}2`, 123);

      const val = AdvancedLS.read(`${key}2`, {});
      expect(val).to.eq(123);
    });

    it('should read existing object entry', () => {
      AdvancedLS.write(`${key}3`, { a: 123, b: 234 });

      const val = AdvancedLS.read<any>(`${key}3`, {});
      expect(val).to.be.ok;
      expect(val.a).to.eq(123);
      expect(val.b).to.eq(234);
    });

    it('should handle missing entry', () => {
      const val = AdvancedLS.read('NON_EXISTENT', {});
      expect(val).to.be.undefined;
    });

    it('should use default value when missing entry', () => {
      const val = AdvancedLS.read<any>('NON_EXISTENT', {}, { missing: true });
      expect(val).to.be.ok;
      expect(val.missing).to.eq(true);
    });
  });

  describe('write with expiry', () => {
    const key = 'TEST4';
    it('expiry should not affect string type', () => {
      AdvancedLS.write(`${key}0`, 'text', { ttl: 3600 });

      const val = localStorage.getItem(`${key}0`);
      expect(val).to.contain('{"value":"text","expiry":');
    });

    it('should write object with expiry prop', () => {
      AdvancedLS.write(`${key}1`, { a: 123 }, { ttl: 3600 });

      const val = localStorage.getItem(`${key}1`);
      expect(val).to.contain('{"value":{"a":123},"expiry":');
    });
  });

  describe('read with expiry', () => {
    const key = 'TEST5';
    it('should read existing string entry', () => {
      AdvancedLS.write(`${key}2`, 'text', { ttl: 3600 });

      const val = AdvancedLS.read(`${key}2`, {});
      expect(val).to.eq('text');
    });

    it('should read existing object entry when not expired', () => {
      AdvancedLS.write(`${key}3`, { a: 123, b: 234 }, { ttl: 3600 });

      const val = AdvancedLS.read<any>(`${key}3`, {});
      expect(val).to.be.ok;
      expect(val.a).to.eq(123);
      expect(val.b).to.eq(234);
    });

    it('should return default value when expired', () => {
      AdvancedLS.write(`${key}4`, { a: 123, b: 234 }, { ttl: -3600 });
      // Writing object that is already expired

      const val = AdvancedLS.read<any>(`${key}4`, {}, null);
      expect(val).to.be.null;
    });

    it('should return undefined when expired', () => {
      AdvancedLS.write(`${key}5`, { a: 123, b: 234 }, { ttl: -3600 });
      // Writing object that is already expired

      const val = AdvancedLS.read<any>(`${key}5`, {});
      expect(val).to.be.undefined;
    });

    it('should read existing numeric entry', () => {
      AdvancedLS.write(`${key}6`, 123, { ttl: 3600 });

      const val = AdvancedLS.read(`${key}6`, {});
      expect(val).to.eq(123);
    });
  });

  describe('write with invalidation token', () => {
    const key = 'TEST6';
    it('should write object with cacheToken prop', () => {
      AdvancedLS.write(`${key}1`, { a: 123 }, { cacheToken: 1 });

      const val = localStorage.getItem(`${key}1`);
      expect(val).to.contain('{"value":{"a":123},"token":');
    });
  });

  describe('read with invalidation token', () => {
    const key = 'TEST7';

    it('should read existing object entry with right cacheToken', () => {
      AdvancedLS.write(`${key}1`, { a: 123, b: 234 }, { cacheToken: 1 });

      const val = AdvancedLS.read<any>(`${key}1`, { cacheToken: 1 }, null);
      expect(val).to.be.ok;
      expect(val.a).to.eq(123);
      expect(val.b).to.eq(234);
    });

    it('should return default value when different cacheToken', () => {
      AdvancedLS.write(`${key}2`, { a: 123, b: 234 }, { cacheToken: 1 });

      const val = AdvancedLS.read<any>(`${key}2`, { cacheToken: 2 }, null);
      expect(val).to.be.null;
    });

    it('should return default value when no cacheToken', () => {
      AdvancedLS.write(`${key}3`, { a: 123, b: 234 }, { cacheToken: 1 });

      const val = AdvancedLS.read<any>(`${key}3`, {}, null);
      expect(val).to.be.null;
    });
  });

  describe('invalidation token AND expiration', () => {
    const key = 'TEST8';

    it('should write invalidation token and expiration', () => {
      AdvancedLS.write(`${key}1`, { a: 123 }, { cacheToken: 1, ttl: 3600 });

      const val = JSON.parse(localStorage.getItem(`${key}1`) || '{}');
      expect(val).to.be.ok;
      expect(val.value?.a).to.eq(123);
      expect(val.token).to.eq(1);
      expect(val.expiry).to.be.ok;
    });

    it('should return value only when valid token and expire not met', () => {
      AdvancedLS.write(`${key}2`, { a: 123 }, { cacheToken: 1, ttl: 3600 });

      const val = AdvancedLS.read<any>(`${key}2`, { cacheToken: 1 }, null);
      expect(val).to.be.ok;
      expect(val.a).to.eq(123);
    });

    it('should return default value when no cacheToken', () => {
      AdvancedLS.write(`${key}3`, { a: 123, b: 234 }, { cacheToken: 1, ttl: 3600 });

      const val = AdvancedLS.read<any>(`${key}3`, {}, null);
      expect(val).to.be.null;
    });

    it('should return default value when expired', () => {
      AdvancedLS.write(`${key}3`, { a: 123, b: 234 }, { cacheToken: 1, ttl: -3600 });

      const val = AdvancedLS.read<any>(`${key}3`, { cacheToken: 1 }, null);
      expect(val).to.be.null;
    });

    it('should return default value when expired and different token', () => {
      AdvancedLS.write(`${key}3`, { a: 123, b: 234 }, { cacheToken: 1, ttl: -3600 });

      const val = AdvancedLS.read<any>(`${key}3`, { cacheToken: 2 }, null);
      expect(val).to.be.null;
    });

    it('should return default value when token was provided for read, and not for the write', () => {
      AdvancedLS.write(`${key}3`, { a: 123, b: 234 }, { ttl: 3600 });

      const val = AdvancedLS.read<any>(`${key}3`, { cacheToken: 2 }, null);
      expect(val).to.be.null;
    });
  });

  describe('update', () => {
    describe('Simple cases', () => {
      const key = 'TEST10';

      it('should update existing object', () => {
        AdvancedLS.write(key, { a: 123, b: 234 });
        AdvancedLS.update(key, { c: 345 });

        const val = AdvancedLS.read<object>(key);
        expect(val).to.deep.equal({ a: 123, b: 234, c: 345 });
      });

      it('should create a value if it does not exist', () => {
        AdvancedLS.update(key, { a: 'test' });

        const val = AdvancedLS.read<object>(key);
        expect(val).deep.equal({ a: 'test' });
      });

      [123, 'test', true].forEach((val) => {
        it(`should cancel update if previous value was a primitive: ${val}`, () => {
          AdvancedLS.write(key, val);

          expect(() => {
            AdvancedLS.update(key, { a: 999 });
          }).to.throw();

          const value = AdvancedLS.read(key);
          expect(value).to.eq(val);
        });
      });
    });

    describe('Token invalidations', () => {
      const key = 'TEST11';

      it('should create value if new cacheToken is used', () => {
        AdvancedLS.write(key, { a: 123 }, { cacheToken: '123456' });
        AdvancedLS.update(key, { b: 'test' }, { cacheToken: '456789' });

        const val = AdvancedLS.read<object>(key, { cacheToken: '456789' });
        expect(val).deep.equal({ b: 'test' });
      });

      it('should update value if it cacheToken matches', () => {
        AdvancedLS.write(key, { a: 123 }, { cacheToken: '123456' });
        AdvancedLS.update(key, { b: 'test' }, { cacheToken: '123456' });

        const val = AdvancedLS.read<object>(key, { cacheToken: '123456' });
        expect(val).deep.equal({ a: 123, b: 'test' });
      });
    });

    describe('Ttl invalidations', () => {
      const key = 'TEST12';

      it('should create value if it expired', () => {
        AdvancedLS.write(key, { a: 123 }, { ttl: -3600 });
        AdvancedLS.update(key, { a: 'test' });

        const val = AdvancedLS.read<object>(key);
        expect(val).deep.equal({ a: 'test' });
      });

      it('should update value if it is still valid', () => {
        AdvancedLS.write(key, { a: 123 }, { ttl: 3600 });
        AdvancedLS.update(key, { b: 'test' }, { ttl: 3600 });

        const val = AdvancedLS.read<object>(key);
        expect(val).deep.equal({ a: 123, b: 'test' });
      });
    });
  });
});
