import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { ReactiveFormsModule, FormsModule } from "@angular/forms"
import { HttpClientModule } from "@angular/common/http"
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"

import { AppRoutingModule } from "./app-routing.module"
import { AppComponent } from "./app.component"

// Components
import { LandingComponent } from "./components/landing/landing.component"
import { RegisterComponent } from "./components/register/register.component"
import { LoginComponent } from "./components/login/login.component"
import { LobbyComponent } from "./components/lobby/lobby.component"
import { GameComponent } from "./components/game/game.component"
import { RankingComponent } from "./components/ranking/ranking.component"
// import { NavigationComponent } from "./components/navigation/navigation.component"

// Services
import { AuthService } from "./services/auth.service"
import { GameService } from "./services/game.service"
import { WebSocketService } from "./services/websocket.service"
import { RouterModule } from "@angular/router"

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    LobbyComponent,
    GameComponent,
    RankingComponent,
    // NavigationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule
  ],
  providers: [AuthService, GameService, WebSocketService],
  bootstrap: [AppComponent],
})
export class AppModule { }
