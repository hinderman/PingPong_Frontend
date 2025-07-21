import { Injectable } from "@angular/core"
import { BehaviorSubject, Observable, of } from "rxjs"
import { delay, tap } from "rxjs/operators"
import { GameRoom, GameState, RankingEntry } from "../models/interfaces"

@Injectable({
  providedIn: "root",
})
export class GameService {
  private currentRoomSubject = new BehaviorSubject<GameRoom | null>(null)
  public currentRoom$ = this.currentRoomSubject.asObservable()

  private gameStateSubject = new BehaviorSubject<GameState | null>(null)
  public gameState$ = this.gameStateSubject.asObservable()

  constructor() { }

  createRoom(): Observable<GameRoom> {
    const roomCode = this.generateRoomCode()
    const newRoom: GameRoom = {
      id: Math.random().toString(36).substring(7),
      code: roomCode,
      players: [],
      status: "waiting",
      createdAt: new Date(),
    }

    return of(newRoom).pipe(
      delay(1500),
      tap((room) => {
        this.currentRoomSubject.next(room)
      }),
    )
  }

  joinRoom(roomCode: string): Observable<GameRoom> {
    // Simulate joining room
    const room: GameRoom = {
      id: Math.random().toString(36).substring(7),
      code: roomCode,
      players: [
        {
          id: "1",
          email: "player1@example.com",
          score: 0,
          paddleY: 150,
          isReady: true,
        },
      ],
      status: "waiting",
      createdAt: new Date(),
    }

    return of(room).pipe(
      delay(1500),
      tap((room) => {
        this.currentRoomSubject.next(room)
      }),
    )
  }

  initializeGame(roomId: string): GameState {
    const initialState: GameState = {
      roomId,
      players: [
        {
          id: "1",
          email: "player1@example.com",
          score: 0,
          paddleY: 150,
          isReady: true,
        },
        {
          id: "2",
          email: "player2@example.com",
          score: 0,
          paddleY: 150,
          isReady: true,
        },
      ],
      ball: {
        x: 400,
        y: 200,
        velocityX: 3,
        velocityY: 2,
      },
      gameStatus: "waiting",
      gameTime: 0,
    }

    this.gameStateSubject.next(initialState)
    return initialState
  }

  updateGameState(newState: Partial<GameState>): void {
    const currentState = this.gameStateSubject.value
    if (currentState) {
      const updatedState = { ...currentState, ...newState }
      this.gameStateSubject.next(updatedState)
    }
  }

  getRankings(): Observable<RankingEntry[]> {
    const mockRankings: RankingEntry[] = [
      { rank: 1, email: "alex.dev@example.com", topScore: 15, gamesPlayed: 42, winRate: 85 },
      { rank: 2, email: "sarah.code@example.com", topScore: 14, gamesPlayed: 38, winRate: 82 },
      { rank: 3, email: "mike.tech@example.com", topScore: 13, gamesPlayed: 35, winRate: 78 },
      { rank: 4, email: "jenny.dev@example.com", topScore: 12, gamesPlayed: 29, winRate: 75 },
      { rank: 5, email: "david.prog@example.com", topScore: 12, gamesPlayed: 31, winRate: 73 },
      { rank: 6, email: "lisa.web@example.com", topScore: 11, gamesPlayed: 28, winRate: 71 },
      { rank: 7, email: "tom.js@example.com", topScore: 11, gamesPlayed: 26, winRate: 69 },
      { rank: 8, email: "anna.react@example.com", topScore: 10, gamesPlayed: 24, winRate: 67 },
      { rank: 9, email: "chris.node@example.com", topScore: 10, gamesPlayed: 22, winRate: 65 },
      { rank: 10, email: "emma.vue@example.com", topScore: 9, gamesPlayed: 20, winRate: 63 },
    ]

    return of(mockRankings).pipe(delay(1000))
  }

  private generateRoomCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  getCurrentRoom(): GameRoom | null {
    return this.currentRoomSubject.value
  }

  getCurrentGameState(): GameState | null {
    return this.gameStateSubject.value
  }
}
