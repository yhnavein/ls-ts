import { expect } from 'chai';
import { LS } from './LS';

describe('LS - LocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('write', () => {
    const key = 'TEST0';
    it('should write string entry', () => {
      LS.write(`${key}1`, 'text');

      const val = localStorage.getItem(`${key}1`);
      expect(val).to.eq('text');
    });

    it('should write object entry', () => {
      LS.write(`${key}2`, { a: 123 });

      const val = localStorage.getItem(`${key}2`);
      expect(val).to.eq('{"a":123}');
    });
  });

  describe('read', () => {
    const key = 'TEST1';
    it('should read existing string entry', () => {
      LS.write(`${key}3`, 'text');

      const val = LS.read(`${key}3`);
      expect(val).to.eq('text');
    });

    it('should read existing numeric entry', () => {
      LS.write(`${key}4`, 123);

      const val = LS.read(`${key}4`);
      expect(val).to.eq(123);
    });

    it('should read existing object entry', () => {
      LS.write(`${key}5`, { a: 123, b: 234 });

      const val = LS.read<any>(`${key}5`);
      expect(val).to.be.ok;
      expect(val.a).to.eq(123);
      expect(val.b).to.eq(234);
    });

    it('should handle missing entry', () => {
      const val = LS.read('NON_EXISTENT');
      expect(val).to.be.undefined;
    });

    it('should use default value when missing entry', () => {
      const val = LS.read<any>('NON_EXISTENT', { missing: true });
      expect(val).to.be.ok;
      expect(val.missing).to.eq(true);
    });
  });

  describe('update', () => {
    const key = 'TEST0';
    it('should update existing object', () => {
      LS.write(key, { a: 123, b: 234 });
      LS.update(key, { c: 345 });

      const val = LS.read<object>(key);
      expect(val).to.deep.equal({ a: 123, b: 234, c: 345 });
    });

    it('should create a value if it does not exist', () => {
      LS.update(key, { a: 'test' });

      const val = LS.read<object>(key);
      expect(val).deep.equal({ a: 'test' });
    });

    it('should make sure example code works fine', () => {
      interface AppState {
        chosenProductId: number;
        userId: number;
        theme: 'dark' | 'light';
      }

      const obj: AppState = {
        chosenProductId: 123,
        userId: 12,
        theme: 'dark',
      };

      LS.write('appState', obj);

      // later on User wants to change the theme and leave the rest of the data intact
      LS.update<AppState>('appState', { theme: 'light' });

      const val = LS.read<AppState>('appState');
      expect(val).deep.equal({
        chosenProductId: 123,
        userId: 12,
        theme: 'light',
      });
    });

    [123, 'test', true].forEach((val) => {
      it(`should cancel update if previous value was a primitive: ${val}`, () => {
        LS.write(key, val);

        expect(() => {
          LS.update(key, { a: 999 });
        }).to.throw();

        const value = LS.read(key);
        expect(value).to.eq(val);
      });
    });
  });
});
