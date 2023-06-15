'use strict';

const { easyLoot, normalLoot, hardLoot } = require('../dungeons');
const Loot = require('./loot');


jest.mock('./loot');

describe('easyLoot', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a reward of normal rarity when lootOdds is less than 80', async () => {
    const mockLoot = { name: 'Normal Reward', rarity: 'normal' };
    Loot.findOne.mockResolvedValueOnce(mockLoot);

    const reward = await easyLoot();

    expect(Loot.findOne).toHaveBeenCalledWith({ rarity: 'normal' });
    expect(reward).toBe(mockLoot.name);
  });

  it('should return a reward of rare rarity when lootOdds is between 80 and 95', async () => {
    const mockLoot = { name: 'Rare Reward', rarity: 'rare' };
    Loot.findOne.mockResolvedValueOnce(mockLoot);

    const reward = await easyLoot();

    expect(Loot.findOne).toHaveBeenCalledWith({ rarity: 'rare' });
    expect(reward).toBe(mockLoot.name);
  });

  it('should return a reward of legendary rarity when lootOdds is between 95 and 100', async () => {
    const mockLoot = { name: 'Legendary Reward', rarity: 'legendary' };
    Loot.findOne.mockResolvedValueOnce(mockLoot);

    const reward = await easyLoot();

    expect(Loot.findOne).toHaveBeenCalledWith({ rarity: 'legendary' });
    expect(reward).toBe(mockLoot.name);
  });

  it('should return an empty string as the reward when lootOdds is 100', async () => {
    const mockLoot = null;
    Loot.findOne.mockResolvedValueOnce(mockLoot);

    const reward = await easyLoot();

    expect(Loot.findOne).toHaveBeenCalledWith({ rarity: 'legendary' });
    expect(reward).toBe('');
  });
});

describe('normalLoot', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a reward of normal rarity when lootOdds is less than 70', async () => {
    const mockLoot = { name: 'Normal Reward', rarity: 'normal' };
    Loot.findOne.mockResolvedValueOnce(mockLoot);

    const reward = await normalLoot();

    expect(Loot.findOne).toHaveBeenCalledWith({ rarity: 'normal' });
    expect(reward).toBe(mockLoot.name);
  });

  it('should return a reward of rare rarity when lootOdds is between 70 and 85', async () => {
    const mockLoot = { name: 'Rare Reward', rarity: 'rare' };
    Loot.findOne.mockResolvedValueOnce(mockLoot);

    const reward = await normalLoot();

    expect(Loot.findOne).toHaveBeenCalledWith({ rarity: 'rare' });
    expect(reward).toBe(mockLoot.name);
  });

  it('should return a reward of legendary rarity when lootOdds is between 85 and 100', async () => {
    const mockLoot = { name: 'Legendary Reward', rarity: 'legendary' };
    Loot.findOne.mockResolvedValueOnce(mockLoot);

    const reward = await normalLoot();

    expect(Loot.findOne).toHaveBeenCalledWith({ rarity: 'legendary' });
    expect(reward).toBe(mockLoot.name);
  });

  it('should return an empty string as the reward when lootOdds is 100', async () => {
    const mockLoot = null;
    Loot.findOne.mockResolvedValueOnce(mockLoot);

    const reward = await normalLoot();

    expect(Loot.findOne).toHaveBeenCalledWith({ rarity: 'legendary' });
    expect(reward).toBe('');
  });
});

describe('hardLoot', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a reward of normal rarity when lootOdds is less than 60', async () => {
    const mockLoot = { name: 'Normal Reward', rarity: 'normal' };
    Loot.findOne.mockResolvedValueOnce(mockLoot);

    const reward = await hardLoot();

    expect(Loot.findOne).toHaveBeenCalledWith({ rarity: 'normal' });
    expect(reward).toBe(mockLoot.name);
  });

  it('should return a reward of rare rarity when lootOdds is between 60 and 75', async () => {
    const mockLoot = { name: 'Rare Reward', rarity: 'rare' };
    Loot.findOne.mockResolvedValueOnce(mockLoot);

    const reward = await hardLoot();

    expect(Loot.findOne).toHaveBeenCalledWith({ rarity: 'rare' });
    expect(reward).toBe(mockLoot.name);
  });

  it('should return a reward of legendary rarity when lootOdds is between 75 and 100', async () => {
    const mockLoot = { name: 'Legendary Reward', rarity: 'legendary' };
    Loot.findOne.mockResolvedValueOnce(mockLoot);

    const reward = await hardLoot();

    expect(Loot.findOne).toHaveBeenCalledWith({ rarity: 'legendary' });
    expect(reward).toBe(mockLoot.name);
  });

  it('should return an empty string as the reward when lootOdds is 100', async () => {
    const mockLoot = null;
    Loot.findOne.mockResolvedValueOnce(mockLoot);

    const reward = await hardLoot();

    expect(Loot.findOne).toHaveBeenCalledWith({ rarity: 'legendary' });
    expect(reward).toBe('');
  });
});
