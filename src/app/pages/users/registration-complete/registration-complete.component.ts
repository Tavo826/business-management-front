import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-registration-complete',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './registration-complete.component.html',
  styleUrl: './registration-complete.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationCompleteComponent {}
