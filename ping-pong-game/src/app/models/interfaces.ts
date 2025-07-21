export interface User {
  id: string
  email: string
  createdAt: Date
}

export interface LoginRequest {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterRequest {
  email: string
  password: string
  confirmPassword: string
}

export interface GameRoom {
  id: string
  code: string
  players: Player[]
  status: "waiting" | "playing" | "finished"
  createdAt: Date
}

export interface Player {
  id: string
  email: string
  score: number
  paddleY: number
  isReady: boolean
}

export interface GameState {
  roomId: string
  players: Player[]
  ball: {
    x: number
    y: number
    velocityX: number
    velocityY: number
  }
  gameStatus: "waiting" | "playing" | "paused" | "finished"
  winner?: string
  gameTime: number
}

export interface RankingEntry {
  rank: number
  email: string
  topScore: number
  gamesPlayed: number
  winRate: number
}
