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

enum Algorithm {
  RANDOM,
  CLOCKWISE
}

export default class Auto2048 {
  private auto!: Auto;

  constructor(public tiles: Tile[], public size, public algorithm: Algorithm) {
    this.setAlgorithm(algorithm);
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
    }
  }

  next(): string {
    return this.auto.next();
  }
}

export { Algorithm };