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
function moveScore(row: Tile[], needReverse: boolean): number {
  if (needReverse) {
    row = row.reverse();
  }
  const array = row.map(tile => tile.number);

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
  if (changed) {
    return score;
  }
  return -1;
}

// -1 means cannot move
function score(tiles: Tile[], size: number, input: string): number {
  if (!DIRCETIONS.includes(input)) {
    return -1;
  }

  let moved = false;
  let sumScore = 0;
  const needReverse = input === "s" || input === "d";
  const isRow = input === "a" || input === "d";
  for (let index = 0; index < size; index++) {
    let score: number;
    if (isRow) {
      score = moveScore(tiles.filter(tile => tile.row === index), needReverse);
    } else {
      score = moveScore(tiles.filter(tile => tile.column === index), needReverse);
    }
    if (score >= 0) {
      sumScore += score;
      moved = true;
    }
  }

  if (moved) {
    return sumScore;
  } else {
    return -1;
  }
}

class GreedyAuto implements Auto {
  private keys: string[];

  constructor(private tiles: Tile[], private size: number) {
    this.keys = [];
  }

  next(): string {
    let bestScore = -1;
    for (const key of DIRCETIONS) {
      const s = score(this.tiles, this.size, key);
      if (s > bestScore) {
        bestScore = s;
        this.keys.length = 0;
        this.keys.push(key);
      } else if (s === bestScore) {
        this.keys.push(key);
      }
    }
    return this.keys[Math.floor(Math.random() * this.keys.length)];
  }
}

// nothing improved at all
class ImprovedGreedyAuto extends GreedyAuto {

  record: Set<string> = new Set();
  count = 0;
  nextActions: string[] = [];

  next(): string {
    const superNext = super.next()
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
        console.log(this.nextActions);
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
    if (score(this.tiles, this.size, this.current[0]) === -1 &&
      score(this.tiles, this.size, this.current[1]) === -1) {
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
  CORNER
}

export default class Auto2048 {
  private auto!: Auto;

  constructor(public tiles: Tile[], public size: number, public algorithm: Algorithm) {
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