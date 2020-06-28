/* eslint-disable @typescript-eslint/no-explicit-any */

describe('prototype', () => {
  test('prototype', () => {
    function Class() {}

    Class.prototype = {
      a: 1,
      b: 2,
      getA: function () {
        return this.a;
      },
      getB: function () {
        return this.b;
      },
      prototypeIs: function () {
        return this.__proto__;
      },
    };

    const i = new Class();

    expect(i.a).toBe(1);
    expect(i.b).toBe(2);
    expect(i.getA()).toBe(1);
    expect(i.getB()).toBe(2);
    expect(i.prototypeIs()).toBe(Class.prototype);

    const o: any = { __proto__: Class.prototype };

    expect(o.a).toBe(1);
    expect(o.b).toBe(2);
    expect(o.getA()).toBe(1);
    expect(o.getB()).toBe(2);
    expect(o.prototypeIs()).toBe(Class.prototype);

    const p = { a: 10 };
    expect(i.getA.bind(p)()).toBe(10);
    expect(i.getB.bind(p)()).toBeUndefined();
    expect(i.prototypeIs.bind(p)()).toBe(Object.prototype);

    const p1 = { __proto__: Class.prototype };
    const p2 = { __proto__: p1, a: 10 };
    const o2: any = { __proto__: p2 };
    expect(o2.a).toBe(10);
    expect(o2.b).toBe(2);
    expect(o2.getA()).toBe(10);
    expect(o2.getB()).toBe(2);
    expect(o2.prototypeIs()).toBe(p2);
    expect(o2.prototypeIs().__proto__).toBe(p1);
    expect(o2.prototypeIs().__proto__.__proto__).toBe(Class.prototype);
  });
});
