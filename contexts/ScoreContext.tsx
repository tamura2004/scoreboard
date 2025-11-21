'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Player, ScoreHistory, RegisteredPlayer } from '@/types';
import { MAX_PLAYERS, MIN_PLAYERS, MIN_SCORE, MAX_SCORE } from '@/constants';

interface ScoreContextType {
  players: Player[];
  history: ScoreHistory[];
  registeredPlayers: RegisteredPlayer[];
  addPlayer: () => void;
  removeLastPlayer: () => void;
  updatePlayerName: (id: string, name: string) => void;
  addScore: (playerId: string, score: number) => void;
  undoHistory: (historyId: string) => void;
  resetAll: () => void;
  addRegisteredPlayer: (name: string) => void;
  updateRegisteredPlayer: (id: string, name: string) => void;
  deleteRegisteredPlayer: (id: string) => void;
}

const ScoreContext = createContext<ScoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PLAYERS: 'scoreboard_players',
  HISTORY: 'scoreboard_history',
  REGISTERED_PLAYERS: 'scoreboard_registered_players',
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
  const [registeredPlayers, setRegisteredPlayers] = useState<RegisteredPlayer[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // localStorageから初期データを読み込む
  useEffect(() => {
    const loadFromStorage = () => {
      try {
        const savedPlayers = localStorage.getItem(STORAGE_KEYS.PLAYERS);
        const savedHistory = localStorage.getItem(STORAGE_KEYS.HISTORY);
        const savedRegisteredPlayers = localStorage.getItem(STORAGE_KEYS.REGISTERED_PLAYERS);

        if (savedPlayers) {
          setPlayers(JSON.parse(savedPlayers));
        }
        if (savedHistory) {
          setHistory(JSON.parse(savedHistory));
        }
        if (savedRegisteredPlayers) {
          setRegisteredPlayers(JSON.parse(savedRegisteredPlayers));
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

  // registeredPlayersが変更されたらlocalStorageに保存
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(STORAGE_KEYS.REGISTERED_PLAYERS, JSON.stringify(registeredPlayers));
      } catch (error) {
        console.error('Failed to save registered players to localStorage:', error);
      }
    }
  }, [registeredPlayers, isInitialized]);

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

  const addRegisteredPlayer = (name: string) => {
    const newPlayer: RegisteredPlayer = {
      id: Date.now().toString(),
      name: name.trim(),
    };
    setRegisteredPlayers([...registeredPlayers, newPlayer]);
  };

  const updateRegisteredPlayer = (id: string, name: string) => {
    setRegisteredPlayers(
      registeredPlayers.map((p) => (p.id === id ? { ...p, name: name.trim() } : p))
    );
  };

  const deleteRegisteredPlayer = (id: string) => {
    setRegisteredPlayers(registeredPlayers.filter((p) => p.id !== id));
  };

  return (
    <ScoreContext.Provider
      value={{
        players,
        history,
        registeredPlayers,
        addPlayer,
        removeLastPlayer,
        updatePlayerName,
        addScore,
        undoHistory,
        resetAll,
        addRegisteredPlayer,
        updateRegisteredPlayer,
        deleteRegisteredPlayer,
      }}
    >
      {children}
    </ScoreContext.Provider>
  );
};
