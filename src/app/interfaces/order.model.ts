export interface Order {
  id: string;
  businessId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  status: string;
  totalAmount: number;
  items: OrderItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderItem {
    productName: string;
    quantity: number;
    unitPrice: number;
}