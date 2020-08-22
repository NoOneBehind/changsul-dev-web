import Player from './base';

class Tiger extends Player {
  constructor (playerIndex) {
    super(playerIndex);
    this.isTiger = true;
  }
}

export default (playerIndex) => new Tiger(playerIndex);
