import { Component, OnInit } from "@angular/core"
import { Router } from "@angular/router"
import { GameService } from "../../services/game.service"
import { AuthService } from "../../services/auth.service"
import { RankingEntry } from "../../models/interfaces"

@Component({
  selector: "app-ranking",
  templateUrl: "./ranking.component.html",
  styleUrls: ["./ranking.component.scss"],
})
export class RankingComponent implements OnInit {
  rankings: RankingEntry[] = []
  filteredRankings: RankingEntry[] = []
  searchTerm = ""
  sortField: keyof RankingEntry = "rank"
  sortDirection: "asc" | "desc" = "asc"
  isLoading = true

  stats = {
    totalPlayers: 1247,
    highestScore: 15,
    totalGames: 8432,
    avgWinRate: 73,
  }

  constructor(
    private gameService: GameService,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadRankings()
  }

  private loadRankings(): void {
    this.gameService.getRankings().subscribe({
      next: (rankings) => {
        this.rankings = rankings
        this.filteredRankings = [...rankings]
        this.isLoading = false
      },
      error: (error) => {
        console.error("Error loading rankings:", error)
        this.isLoading = false
      },
    })
  }

  onSearchChange(): void {
    this.filteredRankings = this.rankings.filter((player) =>
      player.email.toLowerCase().includes(this.searchTerm.toLowerCase()),
    )
    this.applySorting()
  }

  sortBy(field: keyof RankingEntry): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc"
    } else {
      this.sortField = field
      this.sortDirection = "asc"
    }
    this.applySorting()
  }

  private applySorting(): void {
    this.filteredRankings.sort((a, b) => {
      const aValue = a[this.sortField]
      const bValue = b[this.sortField]

      let comparison = 0
      if (aValue > bValue) {
        comparison = 1
      } else if (aValue < bValue) {
        comparison = -1
      }

      return this.sortDirection === "desc" ? -comparison : comparison
    })
  }

  getRankIcon(rank: number): string {
    switch (rank) {
      case 1:
        return "👑"
      case 2:
        return "🥈"
      case 3:
        return "🥉"
      default:
        return `#${rank}`
    }
  }

  getRankBadge(rank: number): { text: string; class: string } | null {
    switch (rank) {
      case 1:
        return { text: "Champion", class: "champion" }
      case 2:
        return { text: "Runner-up", class: "runner-up" }
      case 3:
        return { text: "3rd Place", class: "third-place" }
      default:
        return null
    }
  }

  getWinRateClass(winRate: number): string {
    if (winRate >= 80) return "high"
    if (winRate >= 70) return "medium"
    return "low"
  }

  navigateToLobby(): void {
    this.router.navigate(["/lobby"])
  }

  logout(): void {
    this.authService.logout()
    this.router.navigate(["/"])
  }
}
