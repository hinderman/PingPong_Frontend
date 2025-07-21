import { Component, OnInit, OnDestroy } from "@angular/core"
import { Router } from "@angular/router"
import { Subscription } from "rxjs"
import { GameService } from "../../services/game.service"
import { AuthService } from "../../services/auth.service"
import { GameRoom } from "../../models/interfaces"

@Component({
  selector: "app-lobby",
  templateUrl: "./lobby.component.html",
  styleUrls: ["./lobby.component.scss"],
})
export class LobbyComponent implements OnInit, OnDestroy {
  roomCode = ""
  currentRoom: GameRoom | any = null
  isCreatingRoom = false
  isJoiningRoom = false
  copied = false

  private subscriptions: Subscription[] = []

  stats = {
    activePlayers: 1247,
    activeRooms: 89,
    gamesToday: 5432,
  }

  constructor(
    private gameService: GameService,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.subscriptions.push(
      this.gameService.currentRoom$.subscribe((room) => {
        this.currentRoom = room
      }),
    )
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe())
  }

  createRoom(): void {
    this.isCreatingRoom = true

    this.gameService.createRoom().subscribe({
      next: (room) => {
        this.isCreatingRoom = false
        this.currentRoom = room
      },
      error: (error) => {
        this.isCreatingRoom = false
        console.error("Error creating room:", error)
      },
    })
  }

  joinRoom(): void {
    if (!this.roomCode.trim()) return

    this.isJoiningRoom = true

    this.gameService.joinRoom(this.roomCode).subscribe({
      next: (room) => {
        this.isJoiningRoom = false
        this.router.navigate(["/game"])
      },
      error: (error) => {
        this.isJoiningRoom = false
        console.error("Error joining room:", error)
      },
    })
  }

  startGame(): void {
    this.router.navigate(["/game"])
  }

  async copyRoomCode(): Promise<void> {
    if (this.currentRoom?.code) {
      try {
        await navigator.clipboard.writeText(this.currentRoom.code)
        this.copied = true
        setTimeout(() => (this.copied = false), 2000)
      } catch (err) {
        console.error("Failed to copy room code:", err)
      }
    }
  }

  logout(): void {
    this.authService.logout()
    this.router.navigate(["/"])
  }

  navigateToRanking(): void {
    this.router.navigate(["/ranking"])
  }
}
