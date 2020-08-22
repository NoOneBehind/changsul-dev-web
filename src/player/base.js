const DIRECTION_FACTOR = [1, 0, -1, 0];
const START_POS = [[0, 0], [0, 5], [5, 5], [5, 0]];

export default class Player {
  constructor(playerIndex) {
    this.playerIndex = playerIndex;
    [this.xPos, this.yPos] = START_POS[playerIndex];
    this.isAlive = true;
    this.rope = false;
  }

  moveDown() {
    this.xPos += DIRECTION_FACTOR[(this.playerIndex + 2) % 4];
    this.yPos += DIRECTION_FACTOR[(this.playerIndex + 3) % 4];
    // TODO: move xyPlotter
  }

  moveLeft() {
    this.xPos += DIRECTION_FACTOR[(this.playerIndex + 3) % 4];
    this.yPos += DIRECTION_FACTOR[(this.playerIndex)];
    // TODO: move xyPlotter
  }

  moveRight() {
    this.xPos += DIRECTION_FACTOR[(this.playerIndex + 1) % 4];
    this.yPos += DIRECTION_FACTOR[(this.playerIndex + 2) % 4];
    // TODO: move xyPlotter
  }

  moveUp() {
    this.xPos += DIRECTION_FACTOR[(this.playerIndex)];
    this.yPos += DIRECTION_FACTOR[(this.playerIndex + 1) % 4];
    // TODO: move xyPlotter
  }

  getIsAlive() {
    return this.isAlive;
  }

  getIsTiger() {
    return this.isTiger;
  }

  getRope() {
    return this.rope;
  }

  getPlayerIndex() {
    return this.playerIndex;
  }

  getXPos() {
    return this.xPos;
  }

  getYPos() {
    return this.yPos;
  }

  setIsAlive(isAlive) {
    this.isAlive = isAlive;
  }

  setRope(rope) {
    this.rope = rope;
  }

  setXPos(pos) {
    this.xPos = pos;
  }

  setYPos(pos) {
    this.yPos = pos;
  }
}
