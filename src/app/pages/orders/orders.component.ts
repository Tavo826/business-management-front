import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrdersComponent {

  dataService = inject(DataService);

}
