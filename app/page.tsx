'use client';

import { Container, Typography, Box, Button, AppBar, Toolbar } from '@mui/material';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import HistoryIcon from '@mui/icons-material/History';
import Link from 'next/link';
import { PlayerCard } from '@/components/PlayerCard';
import { useScore } from '@/contexts/ScoreContext';
import { MAX_PLAYERS, MIN_PLAYERS } from '@/constants';

export default function Home() {
  const { players, addPlayer, removeLastPlayer } = useScore();

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
             スコアボード
          </Typography>
          <Button color="inherit" component={Link} href="/history" startIcon={<HistoryIcon />}>
            履歴
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Grid container spacing={2}>
          {players.map((player) => (
            <Grid size={6} key={player.id}>
              <PlayerCard player={player} />
            </Grid>
          ))}

          <Grid size={12}>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button
                variant="outlined"
                onClick={addPlayer}
                startIcon={<AddIcon />}
                disabled={players.length >= MAX_PLAYERS}
                size="large"
                fullWidth
              >
                プレイヤーを追加 ({players.length}/{MAX_PLAYERS})
              </Button>
              <Button
                variant="outlined"
                onClick={removeLastPlayer}
                startIcon={<RemoveIcon />}
                disabled={players.length <= MIN_PLAYERS}
                size="large"
                fullWidth
                color="error"
              >
                プレイヤーを削除
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
