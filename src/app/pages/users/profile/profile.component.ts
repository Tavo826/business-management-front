import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent {

  showPassword = signal(false);
  
  fullName = 'Alex Doe';
  email = 'alex.doe@example.com';
  password = '••••••••';

  togglePasswordVisibility() {
    this.showPassword.set(!this.showPassword());
  }

  onSubmit(event: Event) {
    event.preventDefault();
    console.log('Form submitted', {
      fullName: this.fullName,
      email: this.email,
      password: this.password
    });
  }

}
