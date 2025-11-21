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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';
import { useScore } from '@/contexts/ScoreContext';
import { useState, useRef } from 'react';

export default function Players() {
  const { registeredPlayers, addRegisteredPlayer, updateRegisteredPlayer, deleteRegisteredPlayer } = useScore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPlayerId, setEditingPlayerId] = useState<string>('');
  const [playerName, setPlayerName] = useState('');
  const nameInputRef = useRef<HTMLInputElement>(null);

  const handleDialogEntered = () => {
    nameInputRef.current?.focus();
  };

  const handleOpenAddDialog = () => {
    setPlayerName('');
    setIsAddDialogOpen(true);
  };

  const handleCloseAddDialog = () => {
    setIsAddDialogOpen(false);
    setPlayerName('');
  };

  const handleAddPlayer = () => {
    const trimmedName = playerName.trim();
    if (trimmedName) {
      // 重複チェック
      const isDuplicate = registeredPlayers.some(rp => rp.name === trimmedName);
      if (isDuplicate) {
        alert('同じ名前がすでに登録されています');
        return;
      }
      addRegisteredPlayer(trimmedName);
      handleCloseAddDialog();
    }
  };

  const handleOpenEditDialog = (id: string, name: string) => {
    setEditingPlayerId(id);
    setPlayerName(name);
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingPlayerId('');
    setPlayerName('');
  };

  const handleEditPlayer = () => {
    const trimmedName = playerName.trim();
    if (trimmedName) {
      // 重複チェック（編集中のプレイヤー以外と比較）
      const isDuplicate = registeredPlayers.some(
        rp => rp.id !== editingPlayerId && rp.name === trimmedName
      );
      if (isDuplicate) {
        alert('同じ名前がすでに登録されています');
        return;
      }
      updateRegisteredPlayer(editingPlayerId, trimmedName);
      handleCloseEditDialog();
    }
  };

  const handleDeletePlayer = (id: string, name: string) => {
    if (window.confirm(`「${name}」を削除しますか？`)) {
      deleteRegisteredPlayer(id);
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} href="/" startIcon={<ArrowBackIcon />}>
            戻る
          </Button>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
            プレイヤー名管理
          </Typography>
          <Box sx={{ width: 80 }} />
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 3 }}>
        <Box sx={{ mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAddDialog}
            fullWidth
          >
            プレイヤー名を追加
          </Button>
        </Box>

        {registeredPlayers.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              登録されているプレイヤー名がありません
            </Typography>
          </Paper>
        ) : (
          <Paper>
            <List sx={{ py: 0 }}>
              {registeredPlayers.map((player, index) => (
                <Box key={player.id}>
                  <ListItem
                    secondaryAction={
                      <Box>
                        <IconButton
                          edge="end"
                          onClick={() => handleOpenEditDialog(player.id, player.name)}
                          color="primary"
                          sx={{ mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          onClick={() => handleDeletePlayer(player.id, player.name)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    }
                    sx={{ py: 1.5 }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {player.name}
                    </Typography>
                  </ListItem>
                  {index < registeredPlayers.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          </Paper>
        )}
      </Container>

      {/* 追加ダイアログ */}
      <Dialog
        open={isAddDialogOpen}
        onClose={handleCloseAddDialog}
        maxWidth="xs"
        fullWidth
        TransitionProps={{
          onEntered: handleDialogEntered,
        }}
      >
        <DialogTitle>プレイヤー名を追加</DialogTitle>
        <DialogContent>
          <TextField
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            inputRef={nameInputRef}
            fullWidth
            margin="dense"
            label="プレイヤー名"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddPlayer();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>キャンセル</Button>
          <Button onClick={handleAddPlayer} variant="contained">
            追加
          </Button>
        </DialogActions>
      </Dialog>

      {/* 編集ダイアログ */}
      <Dialog
        open={isEditDialogOpen}
        onClose={handleCloseEditDialog}
        maxWidth="xs"
        fullWidth
        TransitionProps={{
          onEntered: handleDialogEntered,
        }}
      >
        <DialogTitle>プレイヤー名を編集</DialogTitle>
        <DialogContent>
          <TextField
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            inputRef={nameInputRef}
            fullWidth
            margin="dense"
            label="プレイヤー名"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleEditPlayer();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>キャンセル</Button>
          <Button onClick={handleEditPlayer} variant="contained">
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
