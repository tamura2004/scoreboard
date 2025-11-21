export interface Player {
  id: string;
  name: string;
  score: number;
}

export interface ScoreHistory {
  id: string;
  playerId: string;
  playerName: string;
  score: number;
  totalScore: number;
  timestamp: number;
  sequenceNumber: number; // そのプレイヤーに対する何番目の加算か
}

export interface RegisteredPlayer {
  id: string;
  name: string;
}
