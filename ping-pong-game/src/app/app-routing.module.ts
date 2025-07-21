import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"

import { LandingComponent } from "./components/landing/landing.component"
import { RegisterComponent } from "./components/register/register.component"
import { LoginComponent } from "./components/login/login.component"
import { LobbyComponent } from "./components/lobby/lobby.component"
import { GameComponent } from "./components/game/game.component"
import { RankingComponent } from "./components/ranking/ranking.component"
import { AuthGuard } from "./guards/auth.guard"

const routes: Routes = [
  { path: "", component: LandingComponent },
  { path: "register", component: RegisterComponent },
  { path: "login", component: LoginComponent },
  { path: "lobby", component: LobbyComponent, canActivate: [AuthGuard] },
  { path: "game", component: GameComponent, canActivate: [AuthGuard] },
  { path: "ranking", component: RankingComponent, canActivate: [AuthGuard] },
  { path: "**", redirectTo: "" },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
