import { Component } from "@angular/core"
import { Router } from "@angular/router"

@Component({
  selector: "app-landing",
  templateUrl: "./landing.component.html",
  styleUrls: ["./landing.component.scss"],
})
export class LandingComponent {
  features = [
    {
      icon: "⚡",
      title: "Real-Time Sync",
      description: "WebSocket-powered gameplay with millisecond precision for competitive matches.",
    },
    {
      icon: "👥",
      title: "Room System",
      description: "Create private rooms or join with codes. Perfect for team challenges.",
    },
    {
      icon: "🏆",
      title: "Global Rankings",
      description: "Compete for the top spot on our global leaderboard system.",
    },
  ]

  steps = [
    { number: 1, title: "Register", description: "Create your account with email and password" },
    { number: 2, title: "Join Lobby", description: "Create a room or join with a room code" },
    { number: 3, title: "Play", description: "Real-time ping pong with smooth controls" },
    { number: 4, title: "Rank Up", description: "Climb the global leaderboard" },
  ]

  constructor(private router: Router) { }

  navigateToRegister(): void {
    this.router.navigate(["/register"])
  }

  navigateToLogin(): void {
    this.router.navigate(["/login"])
  }
}
