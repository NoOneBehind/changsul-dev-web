import { Box, Grid, Paper } from '@material-ui/core';
import React, { useState } from 'react';

import { createChildren, createTiger } from 'player';

// 플레이어는 4명으로 고정이라 가정
const DOWN = 40;
const LEFT = 37;
const RIGHT = 39;
const UP = 38;

const PLAYER_NUM = 4;
const PLAYER_COLOR = ['error.main', 'warning.main', 'info.main', 'success.main'];
const TIGER_INDEX = (Math.round(Math.random() * 10)) % 4;

const SIDE_LENGTH = 6;

const Main = () => {
  const defaultPlayers = Array(PLAYER_NUM).fill(0).map((v, idx) => (
    idx === TIGER_INDEX ? createTiger(idx) : createChildren(idx)));

  const [players, setPlayers] = useState(defaultPlayers);

  const handleKeyDown = ({ keyCode }) => {
    switch (keyCode) {
      case UP:
        players[3].moveUp();
        break;

      case DOWN:
        players[3].moveDown();
        break;

      case LEFT:
        players[3].moveLeft();
        break;

      case RIGHT:
        players[3].moveRight();
        break;

      default:
        break;
    }
    setPlayers([...players]);
  };

  return (
    <Box>
      <Box width={600} tabIndex={0} ref={(ref) => ref?.focus()} onKeyDown={handleKeyDown}>
        <Grid container spacing={1}>
          {Array(SIDE_LENGTH ** 2).fill(0).map((v, idx) => {
            const xPos = idx % 6;
            const yPos = 5 - Math.floor(idx / 6);

            let playerIndex;
            const bgcolor = players.some((player) => {
              playerIndex = player.getPlayerIndex();
              return player.getXPos() === xPos && player.getYPos() === yPos;
            }) ? PLAYER_COLOR[playerIndex] : 'text.disabled';
            return (
              <Grid item key={+idx} xs={2}>
                <Paper>
                  <Box bgcolor={bgcolor} height={93.33} />
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
};

export default Main;
