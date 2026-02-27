import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts = signal<Toast[]>([]);
  private counter = 0;

  show(message: string, type: ToastType = 'info', durationMs: number = 3000) {
    const id = this.counter++;
    const newToast: Toast = { id, message, type };
    this.toasts.update(current => [...current, newToast]);

    setTimeout(() => {
      this.remove(id);
    }, durationMs);
  }

  remove(id: number) {
    this.toasts.update(current => current.filter(t => t.id !== id));
  }

  success(message: string, durationMs?: number) { this.show(message, 'success', durationMs); }
  error(message: string, durationMs?: number) { this.show(message, 'error', durationMs); }
  info(message: string, durationMs?: number) { this.show(message, 'info', durationMs); }
  warning(message: string, durationMs?: number) { this.show(message, 'warning', durationMs); }
}
