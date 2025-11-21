'use client';

import {
  Container,
  Typography,
  List,
  ListItem,
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

  const formatScore = (score: number) => {
    return score >= 0 ? `+${score}` : `${score}`;
  };

  const canUndo = (historyId: string, playerId: string) => {
    const playerHistories = history.filter((h) => h.playerId === playerId);
    return playerHistories.length > 0 && playerHistories[0].id === historyId;
  };

  // ターン数でグループ化
  const groupedByTurn = history.reduce((acc, item) => {
    const turn = item.sequenceNumber;
    if (!acc[turn]) {
      acc[turn] = [];
    }
    acc[turn].push(item);
    return acc;
  }, {} as Record<number, typeof history>);

  // ターン番号を降順でソート（最新のターンが上）
  const sortedTurns = Object.keys(groupedByTurn)
    .map(Number)
    .sort((a, b) => b - a);

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
          <Box>
            {sortedTurns.map((turn, turnIndex) => (
              <Paper key={turn} sx={{ mb: 2, overflow: 'hidden' }}>
                <Box sx={{ bgcolor: 'grey.100', px: 2, py: 1 }}>
                  <Typography variant="h6" color="text.primary">{turn}ターン</Typography>
                </Box>
                <List sx={{ py: 0 }}>
                  {groupedByTurn[turn].map((item, itemIndex) => {
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
                          sx={{ py: 1.5 }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 2,
                              width: '100%',
                              pr: 6,
                            }}
                          >
                            <Typography variant="body1" sx={{ minWidth: '100px', fontWeight: 'bold' }}>
                              {item.playerName}
                            </Typography>
                            <Typography variant="body1" sx={{ minWidth: '50px', textAlign: 'right' }}>
                              {item.totalScore - item.score}
                            </Typography>
                            <Typography
                              variant="body1"
                              color={item.score >= 0 ? 'primary.main' : 'error.main'}
                              sx={{ minWidth: '60px', fontWeight: 'bold', textAlign: 'right' }}
                            >
                              {formatScore(item.score)}
                            </Typography>
                            <Typography variant="body1" sx={{ minWidth: '50px', fontWeight: 'bold', textAlign: 'right' }}>
                              {item.totalScore}
                            </Typography>
                          </Box>
                        </ListItem>
                        {itemIndex < groupedByTurn[turn].length - 1 && <Divider />}
                      </Box>
                    );
                  })}
                </List>
              </Paper>
            ))}
          </Box>
        )}
      </Container>
    </>
  );
}
