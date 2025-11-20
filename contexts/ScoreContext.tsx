'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Player, ScoreHistory } from '@/types';
import { MAX_PLAYERS, MIN_PLAYERS, MIN_SCORE, MAX_SCORE } from '@/constants';

interface ScoreContextType {
  players: Player[];
  history: ScoreHistory[];
  addPlayer: () => void;
  removeLastPlayer: () => void;
  updatePlayerName: (id: string, name: string) => void;
  addScore: (playerId: string, score: number) => void;
  undoHistory: (historyId: string) => void;
}

const ScoreContext = createContext<ScoreContextType | undefined>(undefined);

export const useScore = () => {
  const context = useContext(ScoreContext);
  if (!context) {
    throw new Error('useScore must be used within ScoreProvider');
  }
  return context;
};

interface ScoreProviderProps {
  children: ReactNode;
}

export const ScoreProvider: React.FC<ScoreProviderProps> = ({ children }) => {
  const [players, setPlayers] = useState<Player[]>([
    { id: '1', name: 'プレイヤー1', score: 0 },
    { id: '2', name: 'プレイヤー2', score: 0 },
    { id: '3', name: 'プレイヤー3', score: 0 },
    { id: '4', name: 'プレイヤー4', score: 0 },
  ]);
  const [history, setHistory] = useState<ScoreHistory[]>([]);

  const addPlayer = () => {
    if (players.length >= MAX_PLAYERS) {
      alert(`プレイヤーは最大${MAX_PLAYERS}人までです`);
      return;
    }
    const newPlayer: Player = {
      id: Date.now().toString(),
      name: `プレイヤー${players.length + 1}`,
      score: 0,
    };
    setPlayers([...players, newPlayer]);
  };

  const removeLastPlayer = () => {
    if (players.length <= MIN_PLAYERS) {
      alert(`プレイヤーは最低${MIN_PLAYERS}人必要です`);
      return;
    }
    const lastPlayer = players[players.length - 1];
    setPlayers(players.slice(0, -1));
    setHistory(history.filter((h) => h.playerId !== lastPlayer.id));
  };

  const updatePlayerName = (id: string, name: string) => {
    setPlayers(players.map((p) => (p.id === id ? { ...p, name } : p)));
    setHistory(history.map((h) => (h.playerId === id ? { ...h, playerName: name } : h)));
  };

  const addScore = (playerId: string, score: number) => {
    const player = players.find((p) => p.id === playerId);
    if (!player) return;

    const newScore = player.score + score;
    if (newScore < MIN_SCORE || newScore > MAX_SCORE) {
      alert(`スコアは${MIN_SCORE}-${MAX_SCORE}の範囲で入力してください`);
      return;
    }

    const historyItem: ScoreHistory = {
      id: Date.now().toString(),
      playerId,
      playerName: player.name,
      score,
      totalScore: newScore,
      timestamp: Date.now(),
    };

    setPlayers(players.map((p) => (p.id === playerId ? { ...p, score: newScore } : p)));
    setHistory([historyItem, ...history]);
  };

  const undoHistory = (historyId: string) => {
    const historyItem = history.find((h) => h.id === historyId);
    if (!historyItem) return;

    const player = players.find((p) => p.id === historyItem.playerId);
    if (!player) return;

    const previousScore = historyItem.totalScore - historyItem.score;
    setPlayers(players.map((p) => (p.id === historyItem.playerId ? { ...p, score: previousScore } : p)));
    setHistory(history.filter((h) => h.id !== historyId));
  };

  return (
    <ScoreContext.Provider
      value={{
        players,
        history,
        addPlayer,
        removeLastPlayer,
        updatePlayerName,
        addScore,
        undoHistory,
      }}
    >
      {children}
    </ScoreContext.Provider>
  );
};
