import { ChangeDetectionStrategy, Component, signal, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { DataService } from '../../services/data.service';
import { CommonModule } from '@angular/common';

interface User {
  name: string;
  role: string;
  avatar: string;
}

interface Metric {
  title: string;
  value: string;
  icon: string;
  colorClass: string;
  change: string;
  isPositive: boolean;
}

interface ChartBar {
  month: string;
  heightPercentage: number;
}

interface Client {
  name: string;
  initials: string;
  detail: string;
  amount: string;
}

interface Order {
  id: string;
  client: string;
  date: string;
  status: string;
  amount: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})



export class DashboardComponent implements OnInit {

  isLoading = signal<boolean>(true);

  ngOnInit() {
    setTimeout(() => {
      this.isLoading.set(false);
    }, 1500);
  }

  currentUser = signal<User>({
    name: 'Innovate Inc.',
    role: 'Personal Account',
    avatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop'
  });

  metrics = signal<Metric[]>([
    {
      title: 'Total Revenue',
      value: '$45,231',
      icon: 'payments',
      colorClass: 'bg-blue',
      change: '+12.5%',
      isPositive: true
    },
    {
      title: 'Active Orders',
      value: '152',
      icon: 'shopping_cart',
      colorClass: 'bg-green',
      change: '+8.2%',
      isPositive: true
    },
    {
      title: 'Total Clients',
      value: '1,234',
      icon: 'group',
      colorClass: 'bg-orange',
      change: '+4.3%',
      isPositive: true
    },
    {
      title: 'Conversion Rate',
      value: '3.24%',
      icon: 'trending_up',
      colorClass: 'bg-purple',
      change: '-0.5%',
      isPositive: false
    }
  ]);

  chartData = signal<ChartBar[]>([
    { month: 'Jan', heightPercentage: 45 },
    { month: 'Feb', heightPercentage: 62 },
    { month: 'Mar', heightPercentage: 78 },
    { month: 'Apr', heightPercentage: 55 },
    { month: 'May', heightPercentage: 85 },
    { month: 'Jun', heightPercentage: 72 },
    { month: 'Jul', heightPercentage: 90 },
    { month: 'Aug', heightPercentage: 68 },
    { month: 'Sep', heightPercentage: 95 },
    { month: 'Oct', heightPercentage: 100 },
    { month: 'Nov', heightPercentage: 82 },
    { month: 'Dec', heightPercentage: 75 }
  ]);

  topClients = signal<Client[]>([
    { name: 'Acme Corporation', initials: 'AC', detail: '24 orders', amount: '$12,450' },
    { name: 'TechStart Inc.', initials: 'TI', detail: '18 orders', amount: '$9,230' },
    { name: 'Global Solutions', initials: 'GS', detail: '15 orders', amount: '$7,890' },
    { name: 'Digital Ventures', initials: 'DV', detail: '12 orders', amount: '$6,540' }
  ]);

  recentOrders = signal<Order[]>([
    { id: '#ORD-2024-001', client: 'John Smith', date: 'Oct 28, 2023', status: 'Completed', amount: '$1,234.00' },
    { id: '#ORD-2024-002', client: 'Sarah Johnson', date: 'Oct 27, 2023', status: 'Processing', amount: '$856.50' },
    { id: '#ORD-2024-003', client: 'Michael Brown', date: 'Oct 27, 2023', status: 'Pending', amount: '$2,145.00' },
    { id: '#ORD-2024-004', client: 'Emily Davis', date: 'Oct 26, 2023', status: 'Completed', amount: '$678.25' },
    { id: '#ORD-2024-005', client: 'David Wilson', date: 'Oct 25, 2023', status: 'Processing', amount: '$1,890.00' }
  ]);

  getMetricBgClass(colorClass: string): string {
    return colorClass;
  }

  getStatusClasses(status: string): string {
    const statusLower = status.toLowerCase();
    if (statusLower === 'completed') return 'completed';
    if (statusLower === 'processing') return 'processing';
    if (statusLower === 'pending') return 'pending';
    return '';
  }

}
