import { ChangeDetectionStrategy, Component, signal, inject, computed, effect } from '@angular/core';
import { BusinessContextService } from '../../services/business-context.service';
import { HttpOrdersProviderService } from '../../services/http-orders-provider.service';
import { Order } from '../../interfaces/order.model';
import { CommonModule } from '@angular/common';

interface Metric {
  title: string;
  value: string;
  icon: string;
  colorClass: string;
}

interface ChartBar {
  month: string;
  heightPercentage: number;
}

interface ClientSummary {
  name: string;
  initials: string;
  detail: string;
  amount: string;
}

interface RecentOrder {
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
export class DashboardComponent {

  businessContext = inject(BusinessContextService);
  private ordersProvider = inject(HttpOrdersProviderService);

  orders = signal<Order[]>([]);
  isLoading = signal<boolean>(true);
  currentYear = new Date().getFullYear();

  constructor() {
    effect(() => {
      const business = this.businessContext.activeBusiness();
      if (business) {
        this.loadOrders(business.nit);
      } else if (!this.businessContext.isLoading()) {
        this.orders.set([]);
        this.isLoading.set(false);
      }
    });
  }

  private loadOrders(businessId: string): void {
    this.isLoading.set(true);
    this.ordersProvider.getOrdersByBusinessId(businessId).subscribe({
      next: (orders) => {
        this.orders.set(orders ?? []);
        this.isLoading.set(false);
      },
      error: () => {
        this.orders.set([]);
        this.isLoading.set(false);
      }
    });
  }

  metrics = computed<Metric[]>(() => {
    const orders = this.orders();
    const confirmed = orders.filter(o => this.normalizeStatus(o.status) === 'CONFIRMED');
    const pending = orders.filter(o => this.normalizeStatus(o.status) === 'PENDING');
    const totalRevenue = confirmed.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const uniqueClients = new Set(
      orders.map(o => o.customerPhone || o.customerName).filter(Boolean)
    ).size;
    const conversionRate = orders.length === 0 ? 0 : (confirmed.length / orders.length) * 100;

    return [
      { title: 'Ingresos Totales', value: this.formatCurrency(totalRevenue), icon: 'payments', colorClass: 'bg-blue' },
      { title: 'Órdenes Pendientes', value: String(pending.length), icon: 'shopping_cart', colorClass: 'bg-green' },
      { title: 'Clientes Totales', value: String(uniqueClients), icon: 'group', colorClass: 'bg-orange' },
      { title: 'Tasa de Conversión', value: conversionRate.toFixed(1) + '%', icon: 'trending_up', colorClass: 'bg-purple' }
    ];
  });

  chartData = computed<ChartBar[]>(() => {
    const orders = this.orders();
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const currentYear = new Date().getFullYear();
    const totals = new Array(12).fill(0);

    for (const o of orders) {
      if (!o.createdAt) continue;
      if (this.normalizeStatus(o.status) !== 'CONFIRMED') continue;
      const date = new Date(o.createdAt);
      if (date.getFullYear() !== currentYear) continue;
      totals[date.getMonth()] += (o.totalAmount || 0);
    }

    const max = Math.max(...totals, 1);
    return months.map((m, i) => ({
      month: m,
      heightPercentage: Math.max(Math.round((totals[i] / max) * 100), totals[i] > 0 ? 5 : 0)
    }));
  });

  topClients = computed<ClientSummary[]>(() => {
    const orders = this.orders();
    const map = new Map<string, { name: string; count: number; amount: number }>();

    for (const o of orders) {
      const key = o.customerPhone || o.customerName;
      if (!key) continue;
      const current = map.get(key) || { name: o.customerName, count: 0, amount: 0 };
      current.count += 1;
      current.amount += (o.totalAmount || 0);
      map.set(key, current);
    }

    return Array.from(map.values())
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 4)
      .map(c => ({
        name: c.name,
        initials: this.getInitials(c.name),
        detail: c.count + (c.count === 1 ? ' orden' : ' órdenes'),
        amount: this.formatCurrency(c.amount)
      }));
  });

  returningRate = computed<number>(() => {
    const orders = this.orders();
    const counts = new Map<string, number>();
    for (const o of orders) {
      const key = o.customerPhone || o.customerName;
      if (!key) continue;
      counts.set(key, (counts.get(key) || 0) + 1);
    }
    if (counts.size === 0) return 0;
    const returning = Array.from(counts.values()).filter(c => c > 1).length;
    return Math.round((returning / counts.size) * 100);
  });

  recentOrders = computed<RecentOrder[]>(() => {
    return [...this.orders()]
      .sort((a, b) => {
        const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return db - da;
      })
      .slice(0, 5)
      .map(o => ({
        id: o.id,
        client: o.customerName,
        date: this.formatDate(o.createdAt),
        status: this.capitalize(o.status),
        amount: this.formatCurrency(o.totalAmount || 0)
      }));
  });

  getMetricBgClass(colorClass: string): string {
    return colorClass;
  }

  getStatusClasses(status: string): string {
    const s = this.normalizeStatus(status);
    if (s === 'CONFIRMED') return 'completed';
    if (s === 'PENDING') return 'pending';
    if (s === 'CANCELED') return 'processing';
    return '';
  }

  private normalizeStatus(status: string): string {
    return (status || '').toUpperCase();
  }

  private getInitials(name: string): string {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || '?';
  }

  private capitalize(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  private formatCurrency(amount: number): string {
    return '$' + amount.toLocaleString('es-CO', { minimumFractionDigits: 0 });
  }

  private formatDate(date?: Date): string {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
