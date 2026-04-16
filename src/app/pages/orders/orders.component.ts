import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BusinessContextService } from '../../services/business-context.service';
import { HttpOrdersProviderService } from '../../services/http-orders-provider.service';
import { Order, OrderItem } from '../../interfaces/order.model';
import { ErrorComponent } from '../../components/error/error.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ErrorComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrdersComponent {

  private fb = inject(FormBuilder);
  private businessContext = inject(BusinessContextService);
  private ordersProvider = inject(HttpOrdersProviderService);

  orders = signal<Order[]>([]);
  isLoading = signal(false);
  searchTerm = signal('');
  activeFilter = signal('All');
  showEditModal = signal(false);
  showErrorModal = signal(false);
  errorMessage = '';
  errorTitle = 'Error en órdenes';

  editingOrder = signal<Order | null>(null);

  orderForm = this.fb.group({
    customerName: ['', [Validators.required, Validators.minLength(2)]],
    customerPhone: ['', [Validators.required]],
    customerAddress: ['', [Validators.required]],
    status: ['', [Validators.required]]
  });

  statuses = ["PENDING", "CONFIRMED"];
  filters = ['All', ...['Processing', 'Shipped', 'Delivered', 'Canceled']];

  filteredOrders = computed(() => {
    let result = this.orders();
    const search = this.searchTerm().toLowerCase();
    const filter = this.activeFilter();

    if (filter !== 'All') {
      result = result.filter(o => o.status === filter);
    }

    if (search) {
      result = result.filter(o =>
        o.id.toLowerCase().includes(search) ||
        o.customerName.toLowerCase().includes(search) ||
        o.items.some(i => i.productName.toLowerCase().includes(search))
      );
    }

    return result;
  });

  constructor() {
    this.loadOrders();
  }

  loadOrders() {
    const business = this.businessContext.activeBusiness();
    if (!business) return;

    this.isLoading.set(true);
    this.ordersProvider.getOrdersByBusinessId(business.nit).subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.isLoading.set(false);
      },
      error: (error: Error) => {
        this.isLoading.set(false);
        console.log('Error loading orders:', error);
        if (!error.message.includes('404')) {
          this.showError(error.message);
        }
      }
    });
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
  }

  setFilter(filter: string) {
    this.activeFilter.set(filter);
  }

  getItemsSummary(items: OrderItem[]): string {
    if (!items || items.length === 0) return 'Sin productos';
    if (items.length === 1) return items[0].productName;
    return items[0].productName + ' (+' + (items.length - 1) + ' más)';
  }

  getItemsCount(items: OrderItem[]): number {
    if (!items) return 0;
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }

  openEditModal(order: Order) {
    this.editingOrder.set({ ...order, items: [...order.items] });
    this.orderForm.patchValue({
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      customerAddress: order.customerAddress,
      status: order.status
    });
    this.showEditModal.set(true);
  }

  closeEditModal() {
    this.showEditModal.set(false);
    this.editingOrder.set(null);
    this.orderForm.reset();
  }

  saveOrder() {
    if (!this.orderForm.valid) {
      Object.keys(this.orderForm.controls).forEach(key => {
        this.orderForm.get(key)?.markAsTouched();
      });
      return;
    }

    const editing = this.editingOrder();
    if (!editing) return;

    const updatedOrder: Partial<Order> = {
      customerName: this.orderForm.value.customerName!,
      customerPhone: this.orderForm.value.customerPhone!,
      customerAddress: this.orderForm.value.customerAddress!,
      status: this.orderForm.value.status!
    };

    this.ordersProvider.updateOrder(editing.id, updatedOrder).subscribe({
      next: () => {
        this.closeEditModal();
        this.loadOrders();
      },
      error: (error) => {
        this.showError(error);
      }
    });
  }

  showError(message: string): void {
    this.errorMessage = message;
    this.showErrorModal.set(true);
  }

  closeErrorModal(): void {
    this.showErrorModal.set(false);
    this.errorMessage = '';
  }

  formatCurrency(amount: number): string {
    return '$' + amount.toLocaleString('es-CO', { minimumFractionDigits: 0 });
  }

  formatDate(date?: Date): string {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
