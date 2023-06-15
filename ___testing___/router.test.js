'use strict';

const { Loot } = require('../src/routes/loot.js');
const { User } = require('../src/routes/User.js'); 

describe('Loot Model', () => {
  it('should be defined', () => {
    expect(Loot).toBeDefined();
  });

  it('should have the required schema fields', () => {
    const loot = new Loot();

    expect(loot.name).toBeUndefined();
    expect(loot.type).toBeUndefined();
    expect(loot.rarity).toBeUndefined();
    expect(loot.gs).toBeUndefined();
  });
});

describe('User Model', () => {
  it('should be defined', () => {
    expect(User).toBeDefined();
  });

  it('should have the required schema fields', () => {
    const user = new User();

    expect(user.name).toBeUndefined();
    expect(user.password).toBeUndefined();
    expect(user.acquiredLoot).toBeInstanceOf(Array);
    expect(user.acquiredLoot.length).toBe(0);
  });
});