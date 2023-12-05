import { expect } from 'chai';
import { SS } from './SS';
import { Storage } from './Storage';

interface Item {
  name: string;
  val?: number;
}

describe('Storage', () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  it('should use localStorage as default driver', () => {
    const key = 'T1';
    const storage = new Storage<Item>(key);
    storage.write({ name: 'Keanu' });
    storage.update({ val: 42 });
    const keanu = storage.read();

    const expectedVal = { name: 'Keanu', val: 42 };
    let val = JSON.parse(localStorage.getItem(key) ?? '{}');
    expect(keanu).deep.equal(expectedVal);
    expect(val).deep.equal(expectedVal);

    storage.remove();
    val = localStorage.getItem(key);
    expect(val).to.be.null;
  });

  it('should use sessionStorage as a custom driver', () => {
    const key = 'T2';
    const storage = new Storage<Item>(key, SS);
    storage.write({ name: 'Keanu' });
    storage.update({ val: 42 });
    const keanu = storage.read();

    const expectedVal = { name: 'Keanu', val: 42 };
    let val = JSON.parse(sessionStorage.getItem(key) ?? '{}');
    expect(keanu).deep.equal(expectedVal);
    expect(val).deep.equal(expectedVal);

    storage.remove();
    val = sessionStorage.getItem(key);
    expect(val).to.be.null;
  });
});
