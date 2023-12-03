import { expect } from 'chai';
import { SS } from './SS';

describe('SS - SessionStorage', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  describe('write', () => {
    const key = 'TEST0';
    it('should write string entry', () => {
      SS.write(`${key}1`, 'text');

      const val = sessionStorage.getItem(`${key}1`);
      expect(val).to.eq('text');
    });

    it('should write object entry', () => {
      SS.write(`${key}2`, { a: 123 });

      const val = sessionStorage.getItem(`${key}2`);
      expect(val).to.eq('{"a":123}');
    });
  });

  describe('read', () => {
    const key = 'TEST1';
    it('should read existing string entry', () => {
      SS.write(`${key}3`, 'text');

      const val = SS.read(`${key}3`);
      expect(val).to.eq('text');
    });

    it('should read existing numeric entry', () => {
      SS.write(`${key}4`, 123);

      const val = SS.read(`${key}4`);
      expect(val).to.eq(123);
    });

    it('should read existing object entry', () => {
      SS.write(`${key}5`, { a: 123, b: 234 });

      const val = SS.read<any>(`${key}5`);
      expect(val).to.be.ok;
      expect(val.a).to.eq(123);
      expect(val.b).to.eq(234);
    });

    it('should handle missing entry', () => {
      const val = SS.read('NON_EXISTENT');
      expect(val).to.be.undefined;
    });

    it('should use default value when missing entry', () => {
      const val = SS.read<any>('NON_EXISTENT', { missing: true });
      expect(val).to.be.ok;
      expect(val.missing).to.eq(true);
    });
  });

  describe('update', () => {
    const key = 'TEST0';
    it('should update existing object', () => {
      SS.write(key, { a: 123, b: 234 });
      SS.update(key, { c: 345 });

      const val = SS.read<object>(key);
      expect(val).to.deep.equal({ a: 123, b: 234, c: 345 });
    });

    it('should create a value if it does not exist', () => {
      SS.update(key, { a: 'test' });

      const val = SS.read<object>(key);
      expect(val).deep.equal({ a: 'test' });
    });

    [123, 'test', true].forEach((val) => {
      it(`should cancel update if previous value was a primitive: ${val}`, () => {
        SS.write(key, val);

        expect(() => {
          SS.update(key, { a: 999 });
        }).to.throw();

        const value = SS.read(key);
        expect(value).to.eq(val);
      });
    });
  });
});
