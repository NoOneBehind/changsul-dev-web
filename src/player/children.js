import Player from './base';

class Children extends Player {
  constructor (playerIndex) {
    super(playerIndex);
    this.isTiger = false;
  }
}

export default (playerIndex) => new Children(playerIndex);
