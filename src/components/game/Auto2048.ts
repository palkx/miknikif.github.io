import Tile from "./TileInfo";

const DIRCETIONS = ["w", "d", "s", "a"];

interface Auto {
  next(): string;
}

class RandomAuto implements Auto {
  next(): string {
    return DIRCETIONS[Math.floor(Math.random() * DIRCETIONS.length)];
  }
}

class ClockwiseAuto implements Auto {
  private index = 0;
  next(): string {
    this.index++;
    return DIRCETIONS[this.index % DIRCETIONS.length];
  }
}

// check the score you can get by move a row
// -1 means cannot move
function moveScore(array: number[], needReverse: boolean): number[] {
  if (needReverse) {
    array = array.reverse();
  }

  let previousIndex = 0;
  let score = 0;
  let changed = false;

  for (let index = 1; index < array.length; index++) {
    if (array[index] === 0) continue;
    while (
      array[previousIndex] != 0 &&
      array[previousIndex] != array[index] &&
      previousIndex < index - 1
    ) {
      previousIndex++;
    }

    if (array[previousIndex] === 0 || array[previousIndex] === array[index]) {
      if (array[previousIndex] === 0) {
        array[previousIndex] = array[index];
      } else {
        array[previousIndex] += 1;
        score += Math.pow(2, array[previousIndex]);
        previousIndex++;
      }
      array[index] = 0;
      changed = true;
    } else {
      previousIndex++;
    }
  }
  if (needReverse) {
    array = array.reverse();
  }
  if (changed) {
    array.push(score);
  } else {
    array.push(-1);
  }
  return array;
}

// -1 means cannot move
function score(tiles: number[], size: number, input: string): number[] {
  if (!DIRCETIONS.includes(input)) {
    tiles.push(-1);
    return tiles;
  }

  tiles = tiles.slice();
  let moved = false;
  let sumScore = 0;
  const needReverse = input === "s" || input === "d";
  const isRow = input === "a" || input === "d";
  for (let index = 0; index < size; index++) {
    let score: number | undefined;
    let row: number[];
    if (isRow) {
      row = moveScore(
        tiles.filter((_tile, i) => Math.floor(i / size) === index),
        needReverse
      );
      score = row.pop();

    } else {
      row = moveScore(
        tiles.filter((_tile, i) => i % size === index),
        needReverse
      );
      score = row.pop();
    }
    if (score != undefined && score >= 0) {
      for (const i in row) {
        if (isRow) {
          tiles[index * size + parseInt(i)] = row[i];
        } else {
          tiles[size * parseInt(i) + index] = row[i];
        }
      }
      sumScore += score;
      moved = true;
    }
  }

  if (moved) {
    tiles.push(sumScore);
  } else {
    tiles.push(-1);
  }
  return tiles;
}

// simply move n steps
// without put new number
function moveSteps(tiles: number[], size: number, step: number) {
  const bestActions: string[][] = [];
  let bestScore = -1;

  for (const input of DIRCETIONS) {
    const actions = [input];
    const moveResult = score(tiles, size, input);

    let moveScore = moveResult.pop();
    if (moveScore === undefined || moveScore === -1) {
      continue;
    }
    if (step > 1) {
      const best = moveSteps(moveResult, size, step - 1);

      moveScore = best.bestScore === -1 ? moveScore : moveScore + best.bestScore;
      actions.push(...best.bestActions);
    }
    if (bestScore < moveScore) {
      bestScore = moveScore;
      bestActions.length = 0;
      bestActions.push(actions);
    } else if (bestScore === moveScore) {
      bestActions.push(actions);
    }
  }

  return {
    bestActions: bestActions[Math.floor(Math.random() * bestActions.length)],
    bestScore: bestScore
  };
}

class GreedyNAuto implements Auto {

  constructor(private tiles: Tile[], private size: number, private defaultStep: number = 3) {
  }

  next(): string {
    const array = this.tiles.map(tile => tile.number);
    const bestActions = moveSteps(array, this.size, this.defaultStep).bestActions;
    console.log("bestActions " + bestActions);
    return bestActions[0];
  }
}

class GreedyAuto extends GreedyNAuto {

  constructor(tiles: Tile[], size: number) {
    super(tiles, size, 1);
  }
}

// nothing improved at all
class ImprovedGreedyAuto extends GreedyAuto {
  record: Set<string> = new Set();
  count = 0;
  nextActions: string[] = [];

  next(): string {
    const superNext = super.next();
    this.record.add(superNext);
    this.count++;

    if (this.count > 10) {
      this.count = 0;
      if (this.record.size < 3) {
        for (const key of DIRCETIONS) {
          if (!this.record.has(key)) {
            this.nextActions.push(key);
          }
        }
        this.record.clear();
      }
    }
    const nextRecord = this.nextActions.pop();
    if (nextRecord) {
      return nextRecord;
    } else {
      return superNext;
    }
  }
}

class CornerAuto implements Auto {
  private leftTop = ["a", "w"];
  private rightBottom = ["d", "s"];
  private index = 0;
  private current: string[];

  constructor(private tiles: Tile[], private size: number) {
    this.current = this.leftTop;
  }

  next(): string {
    const array = this.tiles.map(tile => tile.number);
    if (
      score(array, this.size, this.current[0]).pop() === -1 &&
      score(array, this.size, this.current[1]).pop() === -1
    ) {
      if (this.current === this.leftTop) {
        this.current = this.rightBottom;
      } else {
        this.current = this.leftTop;
      }
    }
    this.index++;
    return this.current[this.index % 2];
  }
}

enum Algorithm {
  RANDOM,
  CLOCKWISE,
  GREEDY,
  IMRPOVED_GREEDY,
  GREEDY_2,
  GREEDY_3,
  CORNER
}

export default class Auto2048 {
  private auto!: Auto;

  constructor(
    public tiles: Tile[],
    public size: number,
    public algorithm: Algorithm
  ) {
    this.setAlgorithm(algorithm);
  }

  changeSize(size: number) {
    this.size = size;
    this.setAlgorithm(this.algorithm);
  }

  setAlgorithm(algorithm: Algorithm) {
    this.algorithm = algorithm;
    switch (this.algorithm) {
      default:
      case Algorithm.RANDOM:
        this.auto = new RandomAuto();
        break;
      case Algorithm.CLOCKWISE:
        this.auto = new ClockwiseAuto();
        break;
      case Algorithm.GREEDY:
        this.auto = new GreedyAuto(this.tiles, this.size);
        break;
      case Algorithm.IMRPOVED_GREEDY:
        this.auto = new ImprovedGreedyAuto(this.tiles, this.size);
        break;
      case Algorithm.GREEDY_2:
        this.auto = new GreedyNAuto(this.tiles, this.size, 2);
        break;
      case Algorithm.GREEDY_3:
        this.auto = new GreedyNAuto(this.tiles, this.size, 3);
        break;
      case Algorithm.CORNER:
        this.auto = new CornerAuto(this.tiles, this.size);
        break;
    }
  }

  next(): string {
    return this.auto.next();
  }
}

export { Algorithm };
