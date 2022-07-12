const lib = require('../lib');
const db = require('../db');
const mail = require('../mail');

describe('Absolute', () => {
  it('Should return a positive number if input is positive', () => {
    const result = lib.absolute(1);
    expect(result).toBe(1);
  });
  
  it('Should return a positive number if input is negative', () => {
    const result = lib.absolute(-1);
    expect(result).toBe(1);
  });
  
  it('Should return 0 if input is 0', () => {
    const result = lib.absolute(0);
    expect(result).toBe(0);
  });
});

describe('Greet', () => {
  it('Should return the greeting message', () => {
    const result = lib.greet('Jimmy Fong');
    expect(result).toContain('Jimmy Fong'); // better matcher fn 
  });
});

describe('Get currencies', () => {
  it('Should return supported currencies', () => {
    const result = lib.getCurrencies();

    // Too general
    // expect(result).toBeDefined();
    // expect(result).not.toBeNull();

    // Too specific
    // expect(result[0]).toBe('USD');
    // expect(result[1]).toBe('AUD');
    // expect(result[2]).toBe('EUR');
    // expect(result.length).toBe(3);

    // Proper way
    // expect(result).toContain('USD');
    // expect(result).toContain('AUD');
    // expect(result).toContain('EUR');

    // Ideal way
    expect(result).toEqual(expect.arrayContaining(['EUR', 'AUD', 'USD']));
  });
});

describe('Get product', () => {
  it('Should return the product with the given ID', () => {
    const result = lib.getProduct(1);

    // Will fail because this line checks memory location
    // expect(result).toBe({ id: 1, price: 10});

    // Will pass because this line checks key-value pair
    expect(result).toEqual({ id: 1, price: 10});

    // Checks whether these keys are present in a large object
    expect(result).toMatchObject({ id: 1, price: 10});

    // Check one property only
    expect(result).toHaveProperty('id', 1);
  });
});

describe('Register user', () => {
  it('Should throw if username is falsy', () => {
    // Falsy: Null, undefined, NaN, '', 0, false
    expect(() => { lib.registerUser(null) }).toThrow();
  });
});

describe('Register user (alterntive, better way', () => {
  it('Should throw if username if falsy', () => {
    const args = [null, undefined, NaN, '', 0, false];
    args.forEach(a => {
      expect(() => { lib.registerUser(a) }).toThrow();
    })
  });

  it('Should return a user object if valid username is passed', () => {
    const result = lib.registerUser('Ishak');
    expect(result).toMatchObject({ username: 'Ishak' });
    expect(result.id).toBeGreaterThan(0);
  });
});

describe('Apply discount', () => {
  it('Should apply 10% discount if customer has more than 10 points', () => {
    db.getCustomerSync = function(customerId) {
      console.log('Pretending to read customer');
      return { id: customerId, points: 20 };
    }

    const order = { customerId: 1, totalPrice: 10 };
    lib.applyDiscount(order);
    expect(order.totalPrice).toBe(9);
  });
});

describe('Notify customer', () => {
  it('Should send an email to the customer', () => {
    db.getCustomerSync = function(customerId) {
      return { email: 'a' };
    };

    let mailSent = false;
    mail.send = function(email, message) {
      mailSent = true;
    }

    lib.notifyCustomer({ customerId: 1 });
    expect(mailSent).toBe(true); 
  });
});

