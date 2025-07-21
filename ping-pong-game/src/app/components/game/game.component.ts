import { Component, OnInit, OnDestroy, ViewChild, ElementRef, HostListener } from "@angular/core"
import { Router } from "@angular/router"
import { Subscription, interval } from "rxjs"
import { GameService } from "../../services/game.service"
import { GameState } from "../../models/interfaces"

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.scss"],
})
export class GameComponent implements OnInit, OnDestroy {
  @ViewChild("gameCanvas", { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>

  gameState: GameState | null = null
  ballPosition = { x: 400, y: 200 }
  ballVelocity = { x: 3, y: 2 }
  paddle1Y = 150
  paddle2Y = 150
  gameEnded = false
  winner = ""

  private gameLoop?: Subscription
  private subscriptions: Subscription[] = []

  readonly CANVAS_WIDTH = 800
  readonly CANVAS_HEIGHT = 400
  readonly PADDLE_WIDTH = 10
  readonly PADDLE_HEIGHT = 80
  readonly BALL_SIZE = 10
  readonly MAX_SCORE = 11

  constructor(
    private gameService: GameService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.initializeGame()
    this.setupCanvas()
    this.subscriptions.push(
      this.gameService.gameState$.subscribe((state) => {
        if (state) {
          this.gameState = state
          this.checkGameEnd()
        }
      }),
    )
  }

  ngOnDestroy(): void {
    this.stopGameLoop()
    this.subscriptions.forEach((sub) => sub.unsubscribe())
  }

  @HostListener("window:keydown", ["$event"])
  handleKeyPress(event: KeyboardEvent): void {
    const moveSpeed = 15

    switch (event.key.toLowerCase()) {
      case "w":
        this.paddle1Y = Math.max(0, this.paddle1Y - moveSpeed)
        console.log('paddle1Y:', this.paddle1Y);

        break
      case "s":
        this.paddle1Y = Math.min(this.CANVAS_HEIGHT - this.PADDLE_HEIGHT, this.paddle1Y + moveSpeed)
        console.log('paddle1Y:', this.paddle1Y);
        break
      case "arrowup":
        event.preventDefault()
        this.paddle2Y = Math.max(0, this.paddle2Y - moveSpeed)
        break
      case "arrowdown":
        event.preventDefault()
        this.paddle2Y = Math.min(this.CANVAS_HEIGHT - this.PADDLE_HEIGHT, this.paddle2Y + moveSpeed)
        break
    }
  }

  private initializeGame(): void {
    const roomId = "demo-room"
    this.gameState = this.gameService.initializeGame(roomId)
  }

  private setupCanvas(): void {
    const canvas = this.canvasRef.nativeElement
    canvas.width = this.CANVAS_WIDTH
    canvas.height = this.CANVAS_HEIGHT
  }

  startGame(): void {
    if (this.gameState) {
      this.gameService.updateGameState({ gameStatus: "playing" })
      this.startGameLoop()
    }
  }

  pauseGame(): void {
    if (this.gameState) {
      const newStatus = this.gameState.gameStatus === "paused" ? "playing" : "paused"
      this.gameService.updateGameState({ gameStatus: newStatus })

      if (newStatus === "playing") {
        this.startGameLoop()
      } else {
        this.stopGameLoop()
      }
    }
  }

  resetGame(): void {
    this.stopGameLoop()
    this.ballPosition = { x: this.CANVAS_WIDTH / 2, y: this.CANVAS_HEIGHT / 2 }
    this.ballVelocity = { x: 3, y: 2 }
    this.paddle1Y = 150
    this.paddle2Y = 150
    this.gameEnded = false
    this.winner = ""

    if (this.gameState) {
      this.gameService.updateGameState({
        gameStatus: "waiting",
        gameTime: 0,
        players: this.gameState.players.map((p) => ({ ...p, score: 0 })),
      })
    }
  }

  private startGameLoop(): void {
    this.stopGameLoop()
    this.gameLoop = interval(16).subscribe(() => {
      if (this.gameState?.gameStatus === "playing") {
        this.updateBallPosition()
        this.updateGameTime()
        this.renderGame()
      }
    })
  }

  private stopGameLoop(): void {
    if (this.gameLoop) {
      this.gameLoop.unsubscribe()
      this.gameLoop = undefined
    }
  }

  private updateBallPosition(): void {
    let newX = this.ballPosition.x + this.ballVelocity.x
    let newY = this.ballPosition.y + this.ballVelocity.y
    let newVelX = this.ballVelocity.x
    let newVelY = this.ballVelocity.y

    // Ball collision with top/bottom walls
    if (newY <= this.BALL_SIZE / 2 || newY >= this.CANVAS_HEIGHT - this.BALL_SIZE / 2) {
      newVelY = -newVelY
      newY = newY <= this.BALL_SIZE / 2 ? this.BALL_SIZE / 2 : this.CANVAS_HEIGHT - this.BALL_SIZE / 2
    }

    // Ball collision with paddles
    if (newX <= 20 + this.PADDLE_WIDTH && newY >= this.paddle1Y && newY <= this.paddle1Y + this.PADDLE_HEIGHT) {
      newVelX = Math.abs(newVelX)
      newX = 20 + this.PADDLE_WIDTH + this.BALL_SIZE / 2
    }

    if (
      newX >= this.CANVAS_WIDTH - 20 - this.PADDLE_WIDTH - this.BALL_SIZE / 2 &&
      newY >= this.paddle2Y &&
      newY <= this.paddle2Y + this.PADDLE_HEIGHT
    ) {
      newVelX = -Math.abs(newVelX)
      newX = this.CANVAS_WIDTH - 20 - this.PADDLE_WIDTH - this.BALL_SIZE / 2
    }

    // Scoring
    if (newX < 0) {
      this.updateScore(2)
      this.resetBall()
      return
    }

    if (newX > this.CANVAS_WIDTH) {
      this.updateScore(1)
      this.resetBall()
      return
    }

    this.ballPosition = { x: newX, y: newY }
    this.ballVelocity = { x: newVelX, y: newVelY }
  }

  private updateScore(playerIndex: number): void {
    if (this.gameState) {
      const updatedPlayers = [...this.gameState.players]
      updatedPlayers[playerIndex - 1].score++
      this.gameService.updateGameState({ players: updatedPlayers })
    }
  }

  private resetBall(): void {
    this.ballPosition = { x: this.CANVAS_WIDTH / 2, y: this.CANVAS_HEIGHT / 2 }
    this.ballVelocity = {
      x: Math.random() > 0.5 ? 3 : -3,
      y: Math.random() > 0.5 ? 2 : -2,
    }
  }

  private updateGameTime(): void {
    if (this.gameState) {
      this.gameService.updateGameState({ gameTime: this.gameState.gameTime + 1 })
    }
  }

  private checkGameEnd(): void {
    if (this.gameState) {
      const player1Score = this.gameState.players[0]?.score || 0
      const player2Score = this.gameState.players[1]?.score || 0

      if (player1Score >= this.MAX_SCORE || player2Score >= this.MAX_SCORE) {
        this.gameEnded = true
        this.winner = player1Score >= this.MAX_SCORE ? "Player 1" : "Player 2"
        this.stopGameLoop()
        this.gameService.updateGameState({ gameStatus: "finished", winner: this.winner })
      }
    }
  }

  private renderGame(): void {
    const canvas = this.canvasRef.nativeElement
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = "#0f172a"
    ctx.fillRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT)

    // Draw center line
    ctx.strokeStyle = "#475569"
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(this.CANVAS_WIDTH / 2, 0)
    ctx.lineTo(this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT)
    ctx.stroke()
    ctx.setLineDash([])

    // Draw paddles
    ctx.fillStyle = "#3b82f6" // Player 1 - Blue
    ctx.fillRect(20, this.paddle1Y, this.PADDLE_WIDTH, this.PADDLE_HEIGHT)

    ctx.fillStyle = "#ef4444" // Player 2 - Red
    ctx.fillRect(this.CANVAS_WIDTH - 20 - this.PADDLE_WIDTH, this.paddle2Y, this.PADDLE_WIDTH, this.PADDLE_HEIGHT)

    // Draw ball
    ctx.fillStyle = "#ffffff"
    ctx.beginPath()
    ctx.arc(this.ballPosition.x, this.ballPosition.y, this.BALL_SIZE / 2, 0, Math.PI * 2)
    ctx.fill()
  }

  formatTime(time: number): string {
    const minutes = Math.floor(time / 3600)
    const seconds = Math.floor((time % 3600) / 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  playAgain(): void {
    this.resetGame()
  }

  backToLobby(): void {
    this.router.navigate(["/lobby"])
  }

  get isPlaying(): boolean {
    return this.gameState?.gameStatus === "playing" || false
  }

  get isPaused(): boolean {
    return this.gameState?.gameStatus === "paused" || false
  }

  get player1Score(): number {
    return this.gameState?.players[0]?.score || 0
  }

  get player2Score(): number {
    return this.gameState?.players[1]?.score || 0
  }

  get gameTime(): number {
    return this.gameState?.gameTime || 0
  }

  get winnerColor(): string {
    return this.winner === "Player 1" ? "text-blue-400" : "text-red-400"
  }
}
