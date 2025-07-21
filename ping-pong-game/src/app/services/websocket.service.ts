import { Injectable } from "@angular/core"
import { Observable, Subject } from "rxjs"

@Injectable({
  providedIn: "root",
})
export class WebSocketService {
  private socket: WebSocket | null = null
  private messageSubject = new Subject<any>()

  constructor() { }

  connect(url: string): void {
    this.socket = new WebSocket(url)

    this.socket.onopen = (event) => {
      console.log("WebSocket connected")
    }

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      this.messageSubject.next(data)
    }

    this.socket.onclose = (event) => {
      console.log("WebSocket disconnected")
    }

    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error)
    }
  }

  sendMessage(message: any): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message))
    }
  }

  getMessages(): Observable<any> {
    return this.messageSubject.asObservable()
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close()
      this.socket = null
    }
  }
}
