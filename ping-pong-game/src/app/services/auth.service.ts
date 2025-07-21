import { Injectable } from "@angular/core"
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from "rxjs"
import { tap, delay } from "rxjs/operators"
import { User, LoginRequest, RegisterRequest } from "../models/interfaces"

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null)
  public currentUser$ = this.currentUserSubject.asObservable()

  private apiUrl = "http://localhost:5000/api" // Your .NET API URL

  constructor(private http: HttpClient) {
    // Check if user is logged in on service initialization
    const savedUser = localStorage.getItem("currentUser")
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser))
    }
  }

  register(registerData: RegisterRequest): Observable<any> {
    // Simulate API call for demo
    return of({ success: true, message: "Registration successful" }).pipe(
      delay(2000),
      tap((response) => {
        if (response.success) {
          console.log("User registered successfully")
        }
      }),
    )

    // Real implementation:
    // return this.http.post(`${this.apiUrl}/auth/register`, registerData);
  }

  login(loginData: LoginRequest): Observable<User> {
    // Simulate API call for demo
    const mockUser: User = {
      id: "1",
      email: loginData.email,
      createdAt: new Date(),
    }

    return of(mockUser).pipe(
      delay(1500),
      tap((user) => {
        localStorage.setItem("currentUser", JSON.stringify(user))
        if (loginData.rememberMe) {
          localStorage.setItem("rememberMe", "true")
        }
        this.currentUserSubject.next(user)
      }),
    )

    // Real implementation:
    // return this.http.post<User>(`${this.apiUrl}/auth/login`, loginData)
    //   .pipe(tap(user => {
    //     localStorage.setItem('currentUser', JSON.stringify(user));
    //     this.currentUserSubject.next(user);
    //   }));
  }

  logout(): void {
    localStorage.removeItem("currentUser")
    localStorage.removeItem("rememberMe")
    this.currentUserSubject.next(null)
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value
  }
}
