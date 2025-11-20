'use client';

import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  AppBar,
  Toolbar,
  Button,
  Box,
  Paper,
  Divider,
} from '@mui/material';
import UndoIcon from '@mui/icons-material/Undo';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';
import { useScore } from '@/contexts/ScoreContext';

export default function History() {
  const { history, undoHistory } = useScore();

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('ja-JP', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatScore = (score: number) => {
    return score >= 0 ? `+${score}` : `${score}`;
  };

  const canUndo = (historyId: string, playerId: string) => {
    const playerHistories = history.filter((h) => h.playerId === playerId);
    return playerHistories.length > 0 && playerHistories[0].id === historyId;
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} href="/" startIcon={<ArrowBackIcon />}>
            戻る
          </Button>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
            スコア履歴
          </Typography>
          <Box sx={{ width: 80 }} />
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 3 }}>
        {history.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              履歴がありません
            </Typography>
          </Paper>
        ) : (
          <List>
            {history.map((item, index) => {
              const isUndoable = canUndo(item.id, item.playerId);
              return (
                <Box key={item.id}>
                  <ListItem
                    secondaryAction={
                      <IconButton
                        edge="end"
                        onClick={() => undoHistory(item.id)}
                        color="primary"
                        size="large"
                        disabled={!isUndoable}
                      >
                        <UndoIcon />
                      </IconButton>
                    }
                    sx={{ py: 2 }}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="h6">{item.playerName}</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography
                              variant="h6"
                              color={item.score >= 0 ? 'primary.main' : 'error.main'}
                              sx={{ fontWeight: 'bold' }}
                            >
                              {formatScore(item.score)}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                              →
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                              {item.totalScore}
                            </Typography>
                          </Box>
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(item.timestamp)}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {index < history.length - 1 && <Divider />}
                </Box>
              );
            })}
          </List>
        )}
      </Container>
    </>
  );
}
