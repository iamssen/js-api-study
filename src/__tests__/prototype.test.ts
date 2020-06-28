/* eslint-disable @typescript-eslint/no-explicit-any */

describe('prototype', () => {
  function Class() {}

  Class.prototype.a = 1;
  Class.prototype.b = 2;
  Class.prototype.getA = function () {
    return this.a;
  };
  Class.prototype.getB = function () {
    return this.b;
  };
  Class.prototype.getPrototype = function () {
    return this.__proto__;
  };

  test('prototype', () => {
    const i = new Class();

    expect(i.a).toBe(1);
    expect(i.b).toBe(2);
    expect(i.getA()).toBe(1);
    expect(i.getB()).toBe(2);
    expect(i.getPrototype()).toBe(Class.prototype);

    const o: any = { __proto__: Class.prototype };

    expect(o.a).toBe(1);
    expect(o.b).toBe(2);
    expect(o.getA()).toBe(1);
    expect(o.getB()).toBe(2);
    expect(o.getPrototype()).toBe(Class.prototype);

    const p = { a: 10 };
    expect(i.getA.bind(p)()).toBe(10);
    expect(i.getB.bind(p)()).toBeUndefined();
    expect(i.getPrototype.bind(p)()).toBe(Object.prototype);
  });

  test('multiple inheritance', () => {
    const proto1 = { __proto__: Class.prototype };
    const proto2 = { __proto__: proto1, a: 10 };
    const instance: any = { __proto__: proto2 };
    expect(instance.a).toBe(10);
    expect(instance.b).toBe(2);
    expect(instance.getA()).toBe(10);
    expect(instance.getB()).toBe(2);
    expect(instance.getPrototype()).toBe(proto2);
    expect(instance.getPrototype().__proto__).toBe(proto1);
    expect(instance.getPrototype().__proto__.__proto__).toBe(Class.prototype);
    expect(instance.getPrototype().__proto__.__proto__.__proto__).toBe(Object.prototype);
  });

  test('prototype link', () => {
    const proto1 = {
      a: 1,
      b: 2,
      fn: function () {
        return this.a;
      },
      getPrototype: function () {
        return this.__proto__;
      },
    };

    const proto2 = { __proto__: proto1 };
    const proto3 = { __proto__: proto2, a: 10 };
    const instance: any = { __proto__: proto3 };
    expect(instance.a).toBe(10);
    expect(instance.b).toBe(2);
    expect(instance.fn()).toBe(10);
    expect(instance.getPrototype()).toBe(proto3);
    expect(instance.getPrototype().__proto__).toBe(proto2);
    expect(instance.getPrototype().__proto__.__proto__).toBe(proto1);
    expect(instance.getPrototype().__proto__.__proto__.__proto__).toBe(Object.prototype);
    expect(instance.getPrototype().__proto__.__proto__.__proto__.__proto__).toBeNull();
  });

  test('constructor', () => {
    const Class = {
      constructor: function () {
        const instance = { __proto__: Class.prototype };
        return instance;
      },

      prototype: {
        a: 1,
        b: 2,
        fn: function () {
          return this.a + this.b;
        },
      },
    };

    expect(() => {
      //@ts-ignore
      const instance = new Class();
    }).toThrow();
  });
});
