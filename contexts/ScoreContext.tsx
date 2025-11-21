'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
  resetAll: () => void;
}

const ScoreContext = createContext<ScoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PLAYERS: 'scoreboard_players',
  HISTORY: 'scoreboard_history',
};

const DEFAULT_PLAYERS: Player[] = [
  { id: '1', name: 'プレイヤー1', score: 0 },
  { id: '2', name: 'プレイヤー2', score: 0 },
  { id: '3', name: 'プレイヤー3', score: 0 },
  { id: '4', name: 'プレイヤー4', score: 0 },
];

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
  const [players, setPlayers] = useState<Player[]>(DEFAULT_PLAYERS);
  const [history, setHistory] = useState<ScoreHistory[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // localStorageから初期データを読み込む
  useEffect(() => {
    const loadFromStorage = () => {
      try {
        const savedPlayers = localStorage.getItem(STORAGE_KEYS.PLAYERS);
        const savedHistory = localStorage.getItem(STORAGE_KEYS.HISTORY);

        if (savedPlayers) {
          setPlayers(JSON.parse(savedPlayers));
        }
        if (savedHistory) {
          setHistory(JSON.parse(savedHistory));
        }
      } catch (error) {
        console.error('Failed to load from localStorage:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    loadFromStorage();
  }, []);

  // playersが変更されたらlocalStorageに保存
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(players));
      } catch (error) {
        console.error('Failed to save players to localStorage:', error);
      }
    }
  }, [players, isInitialized]);

  // historyが変更されたらlocalStorageに保存
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
      } catch (error) {
        console.error('Failed to save history to localStorage:', error);
      }
    }
  }, [history, isInitialized]);

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

    // そのプレイヤーの履歴数を数えて、次のシーケンス番号を決定
    const playerHistoryCount = history.filter((h) => h.playerId === playerId).length;
    const sequenceNumber = playerHistoryCount + 1;

    const historyItem: ScoreHistory = {
      id: Date.now().toString(),
      playerId,
      playerName: player.name,
      score,
      totalScore: newScore,
      timestamp: Date.now(),
      sequenceNumber,
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

  const resetAll = () => {
    setPlayers(DEFAULT_PLAYERS);
    setHistory([]);
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
        resetAll,
      }}
    >
      {children}
    </ScoreContext.Provider>
  );
};
