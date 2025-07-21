import { Component, OnInit } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { Router } from "@angular/router"
import { AuthService } from "../../services/auth.service"

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup
  isLoading = false
  errorMessage = ""

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.initializeForm()
  }

  private initializeForm(): void {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]],
      rememberMe: [false],
    })
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true
      this.errorMessage = ""

      this.authService.login(this.loginForm.value).subscribe({
        next: (user) => {
          this.isLoading = false
          this.router.navigate(["/lobby"])
        },
        error: (error) => {
          this.isLoading = false
          this.errorMessage = error.message || "Login failed. Please check your credentials."
        },
      })
    } else {
      this.markFormGroupTouched()
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach((key) => {
      const control = this.loginForm.get(key)
      control?.markAsTouched()
    })
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName)

    if (field?.errors && field.touched) {
      if (field.errors["required"]) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`
      }
      if (field.errors["email"]) {
        return "Please enter a valid email address"
      }
    }

    return ""
  }

  hasFieldError(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName)
    return !!(field?.errors && field.touched)
  }

  navigateToRegister(): void {
    this.router.navigate(["/register"])
  }

  navigateHome(): void {
    this.router.navigate(["/"])
  }
}
