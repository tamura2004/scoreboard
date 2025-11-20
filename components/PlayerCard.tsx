'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Typography,
  Box,
  Stack,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Player } from '@/types';
import { useScore } from '@/contexts/ScoreContext';
import { ScoreButton } from './ScoreButton';

interface PlayerCardProps {
  player: Player;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => {
  const { updatePlayerName, addScore } = useScore();
  const [addScoreValue, setAddScoreValue] = useState<number>(0);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(player.name);

  const handleAddScore = () => {
    if (addScoreValue === 0) {
      return;
    }
    addScore(player.id, addScoreValue);
    setAddScoreValue(0);
  };

  const handleNameBlur = () => {
    if (nameValue.trim()) {
      updatePlayerName(player.id, nameValue);
    } else {
      setNameValue(player.name);
    }
    setIsEditingName(false);
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
        <Stack spacing={1}>
          {/* 1行目: プレイヤー名 */}
          <Box>
            {isEditingName ? (
              <TextField
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                onBlur={handleNameBlur}
                autoFocus
                size="small"
                fullWidth
              />
            ) : (
              <Typography
                variant="h6"
                onClick={() => setIsEditingName(true)}
                sx={{ cursor: 'pointer' }}
                noWrap
              >
                {player.name}
              </Typography>
            )}
          </Box>

          {/* 2行目: 合計スコア、加算ボタン、加算スコア */}
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', width: '120px' }}>
              <Typography variant="h2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {player.score}
              </Typography>
            </Box>

            <IconButton
              color="primary"
              onClick={handleAddScore}
              disabled={addScoreValue === 0}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                width: 48,
                height: 48,
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
                '&:disabled': {
                  bgcolor: 'action.disabledBackground',
                },
              }}
            >
              <AddIcon fontSize="large" />
            </IconButton>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <ScoreButton value={addScoreValue} onChange={setAddScoreValue} />
            </Box>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
