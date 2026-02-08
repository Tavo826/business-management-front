import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-sidebar-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './sidebar-layout.component.html',
  styleUrl: './sidebar-layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarLayoutComponent {

}
