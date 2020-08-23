import {
  Box, CircularProgress, Grid, Paper,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';

import { subscribe } from 'database';

const PLAYER_COLOR = ['error.main', 'warning.main', 'info.main', 'success.main'];
const ROPE_COLOR = 'secondary.main';
const SIDE_LENGTH = 6;

const App = () => {
  const [players, setPlayers] = useState();
  useEffect(() => {
    subscribe(setPlayers);
  }, []);

  if (!players) {
    return <CircularProgress />;
  }

  const { playerIndex: tigerIndex } = players.filter(({ isTiger }) => isTiger)?.pop();
  const tigerBlcokIndex = (5 - players[tigerIndex].yPos) * 6 + players[tigerIndex].xPos;
  const ropeBlockIndex = (5 - 2) * 6 + 2;

  return (
    <Box>
      <Box width={600}>
        <Grid container spacing={1}>
          {Array(SIDE_LENGTH ** 2).fill(0).map((v, idx) => {
            const xPos = idx % 6;
            const yPos = 5 - Math.floor(idx / 6);
            let playerIndex;
            const bgcolor = players.some((player) => {
              playerIndex = player.playerIndex;
              return player.xPos === xPos && player.yPos === yPos;
            }) ? PLAYER_COLOR[playerIndex] : 'text.disabled';
            return (
              <Grid item key={+idx} xs={2}>
                <Paper>
                  <Box bgcolor={ropeBlockIndex === idx ? ROPE_COLOR : bgcolor} height={93.33}>
                    {tigerBlcokIndex === idx ? 'Tiger' : null}
                    {ropeBlockIndex === idx ? 'Rope' : null}
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
};

export default App;
