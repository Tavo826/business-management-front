import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {

  mode = signal<'signin' | 'register'>('signin');
  showPassword = signal(false);

  constructor(private router: Router) {}

  login(e: Event) {
    e.preventDefault();

    this.router.navigate(['/app/dashboard']);
  }
  
  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  togglePasswordVisibility() {
    console.log(this.showPassword());
    this.showPassword.set(!this.showPassword());
  }

}
