const checkAllChildrenAreKilled = (players) => (
  players.filter((player) => !player.getIsTiger()).every((children) => !children.getIsAlive()));

const checkRopeChildrenIsKilled = (players) => (
  players.some((player) => !player.getIsTiger() && player.getRope() && !player.getIsAlive()));

const checkTigerHasRope = (players) => (
  players.some((player) => player.getIsTiger() && player.getRope()));
