'use strict';

const { dungeonEasyOdds, dungeonNormalOdds, dungeonHardOdds } = require('../dungeons');

// Mock the necessary dependencies
jest.mock('./easyLoot');

describe('dungeonEasyOdds', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should log "You Win!" and call easyLoot when score is greater than 25', () => {
    const mockStory = jest.fn();
    const mockEasyLoot = jest.fn();

    global.console.log = jest.fn(); // Mock console.log

    const originalMathRandom = Math.random;
    Math.random = jest.fn().mockReturnValue(0.3); // Set score to 30

    dungeonEasyOdds();

    expect(mockStory).toHaveBeenCalled();
    expect(global.console.log).toHaveBeenCalledWith('You Win!');
    expect(mockEasyLoot).toHaveBeenCalled();

    Math.random = originalMathRandom; // Restore Math.random
  });

  it('should log "You Lose!" when score is less than or equal to 25', () => {
    const mockStory = jest.fn();
    const mockEasyLoot = jest.fn();

    global.console.log = jest.fn(); // Mock console.log

    const originalMathRandom = Math.random;
    Math.random = jest.fn().mockReturnValue(0.2); // Set score to 20

    dungeonEasyOdds();

    expect(mockStory).toHaveBeenCalled();
    expect(global.console.log).toHaveBeenCalledWith('You Lose!');
    expect(mockEasyLoot).not.toHaveBeenCalled();

    Math.random = originalMathRandom; // Restore Math.random
  });
});

describe('dungeonNormalOdds', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should log "You Win!" and call normalLoot when oddResult is greater than 50', () => {
    const mockStory = jest.fn();
    const mockNormalLoot = jest.fn();

    global.console.log = jest.fn(); // Mock console.log

    const originalMathRandom = Math.random;
    Math.random = jest.fn().mockReturnValue(0.6); // Set oddResult to 60

    dungeonNormalOdds();

    expect(mockStory).toHaveBeenCalled();
    expect(global.console.log).toHaveBeenCalledWith('You Win!');
    expect(mockNormalLoot).toHaveBeenCalled();

    Math.random = originalMathRandom; // Restore Math.random
  });

  it('should log "You Lose!" when oddResult is less than or equal to 50', () => {
    const mockStory = jest.fn();
    const mockNormalLoot = jest.fn();

    global.console.log = jest.fn(); // Mock console.log

    const originalMathRandom = Math.random;
    Math.random = jest.fn().mockReturnValue(0.4); // Set oddResult to 40

    dungeonNormalOdds();

    expect(mockStory).toHaveBeenCalled();
    expect(global.console.log).toHaveBeenCalledWith('You Lose!');
    expect(mockNormalLoot).not.toHaveBeenCalled();

    Math.random = originalMathRandom; // Restore Math.random
  });
});

describe('dungeonHardOdds', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should log "You Win!" and call hardLoot when score is greater than 75', () => {
    const mockStory = jest.fn();
    const mockHardLoot = jest.fn();

    global.console.log = jest.fn(); // Mock console.log

    const originalMathRandom = Math.random;
    Math.random = jest.fn().mockReturnValue(0.8); // Set score to 80

    dungeonHardOdds();

    expect(mockStory).toHaveBeenCalled();
    expect(global.console.log).toHaveBeenCalledWith('You Win!');
    expect(mockHardLoot).toHaveBeenCalled();

    Math.random = originalMathRandom; // Restore Math.random
  });

  it('should log "You Lose!" when score is less than or equal to 75', () => {
    const mockStory = jest.fn();
    const mockHardLoot = jest.fn();

    global.console.log = jest.fn(); // Mock console.log

    const originalMathRandom = Math.random;
    Math.random = jest.fn().mockReturnValue(0.7); // Set score to 70

    dungeonHardOdds();

    expect(mockStory).toHaveBeenCalled();
    expect(global.console.log).toHaveBeenCalledWith('You Lose!');
    expect(mockHardLoot).not.toHaveBeenCalled();

    Math.random = originalMathRandom; // Restore Math.random
  });
});