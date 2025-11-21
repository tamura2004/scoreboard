'use client';

import { Container, Typography, AppBar, Toolbar, IconButton, Tooltip } from '@mui/material';
import Grid from '@mui/material/Grid';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import HistoryIcon from '@mui/icons-material/History';
import PeopleIcon from '@mui/icons-material/People';
import Link from 'next/link';
import { PlayerCard } from '@/components/PlayerCard';
import { useScore } from '@/contexts/ScoreContext';
import { MAX_PLAYERS, MIN_PLAYERS } from '@/constants';

export default function Home() {
  const { players, addPlayer, removeLastPlayer, resetAll } = useScore();

  const handleReset = () => {
    if (window.confirm('すべてのプレイヤーとスコア履歴を初期化しますか？')) {
      resetAll();
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
             スコアボード
          </Typography>
          <Tooltip title={`プレイヤーを追加 (${players.length}/${MAX_PLAYERS})`}>
            <span>
              <IconButton
                color="inherit"
                onClick={addPlayer}
                disabled={players.length >= MAX_PLAYERS}
                sx={{ mr: 2 }}
              >
                <PersonAddIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="プレイヤーを削除">
            <span>
              <IconButton
                color="inherit"
                onClick={removeLastPlayer}
                disabled={players.length <= MIN_PLAYERS}
                sx={{ mr: 2 }}
              >
                <PersonRemoveIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="初期化">
            <IconButton
              color="inherit"
              onClick={handleReset}
              sx={{ mr: 2 }}
            >
              <RestartAltIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="プレイヤー名管理">
            <IconButton
              color="inherit"
              component={Link}
              href="/players"
              sx={{ mr: 2 }}
            >
              <PeopleIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="履歴">
            <IconButton
              color="inherit"
              component={Link}
              href="/history"
            >
              <HistoryIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Grid container spacing={2}>
          {players.map((player) => (
            <Grid size={6} key={player.id}>
              <PlayerCard player={player} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}
