'use client';

import React, { useState, useRef } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Typography,
  Box,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { Player } from '@/types';
import { useScore } from '@/contexts/ScoreContext';
import { ScoreButton } from './ScoreButton';

interface PlayerCardProps {
  player: Player;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => {
  const { players, updatePlayerName, addScore, history, registeredPlayers, addRegisteredPlayer } = useScore();
  const [addScoreValue, setAddScoreValue] = useState<number>(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [nameValue, setNameValue] = useState(player.name);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // このプレイヤーの現在のターン数を取得
  const currentTurn = history.filter((h) => h.playerId === player.id).length;

  const handleDialogEntered = () => {
    // ダイアログのアニメーション完了後にフォーカスを当てる
    nameInputRef.current?.focus();
  };

  const handleAddScore = () => {
    if (addScoreValue === 0) {
      return;
    }
    addScore(player.id, addScoreValue);
    setAddScoreValue(0);
  };

  const handleOpenDialog = () => {
    // 初期値が「プレイヤー＋数字」のパターンかチェック
    const defaultNamePattern = /^プレイヤー\d+$/;
    if (defaultNamePattern.test(player.name)) {
      setNameValue('');
    } else {
      setNameValue(player.name);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setNameValue(player.name);
  };

  const handleSaveName = () => {
    const trimmedName = nameValue.trim();
    if (trimmedName) {
      // 他のプレイヤーと同じ名前がないかチェック
      const isDuplicatePlayer = players.some(
        p => p.id !== player.id && p.name === trimmedName
      );
      if (isDuplicatePlayer) {
        alert('同じ名前のプレイヤーがすでに存在します');
        return;
      }

      // デフォルト名のパターン（プレイヤー＋数字）以外で、登録済みプレイヤー名に存在しない場合は追加
      const defaultNamePattern = /^プレイヤー\d+$/;
      const isDefaultName = defaultNamePattern.test(trimmedName);
      const isAlreadyRegistered = registeredPlayers.some(rp => rp.name === trimmedName);

      if (!isDefaultName && !isAlreadyRegistered) {
        addRegisteredPlayer(trimmedName);
      }

      updatePlayerName(player.id, trimmedName);
      setIsDialogOpen(false);
    } else {
      setNameValue(player.name);
    }
  };

  const handleSelectRegisteredPlayer = (event: any) => {
    setNameValue(event.target.value);
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
        <Stack spacing={1}>
          {/* 1行目: プレイヤー名 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton
              size="small"
              onClick={handleOpenDialog}
              sx={{ p: 0.5 }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              {player.name}
              <Typography
                component="span"
                variant="body2"
                color="text.secondary"
                sx={{ ml: 1 }}
              >
                ({currentTurn}ターン)
              </Typography>
            </Typography>
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

      {/* 編集ダイアログ */}
      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="xs"
        fullWidth
        TransitionProps={{
          onEntered: handleDialogEntered,
        }}
      >
        <DialogTitle>プレイヤー名の編集</DialogTitle>
        <DialogContent>
{registeredPlayers.length > 0 && (
            <FormControl fullWidth margin="dense">
              <InputLabel>登録済みプレイヤー名から選択</InputLabel>
              <Select
                value=""
                onChange={handleSelectRegisteredPlayer}
                label="登録済みプレイヤー名から選択"
              >
                {registeredPlayers.map((rp) => (
                  <MenuItem key={rp.id} value={rp.name}>
                    {rp.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          <TextField
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
            inputRef={nameInputRef}
            fullWidth
            margin="dense"
            label="プレイヤー名"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSaveName();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>キャンセル</Button>
          <Button onClick={handleSaveName} variant="contained">
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};
