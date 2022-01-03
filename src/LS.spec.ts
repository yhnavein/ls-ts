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
});
