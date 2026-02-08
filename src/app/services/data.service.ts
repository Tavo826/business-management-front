import { Injectable, signal } from "@angular/core";

export interface Business {
  id: number;
  name: string;
  status: string;
  statusColor: string;
  image: string;
}

export interface Order {
  id: string;
  productName: string;
  productImage: string;
  customer: string;
  date: string;
  total: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Canceled';
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  readonly businesses = signal<Business[]>([
    {
      id: 1,
      name: 'Innovate Solutions Inc.',
      status: '15 Active Orders',
      statusColor: 'text-primary',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCf6SDuCD4f5poLK4LtMtOFnyIKrLwAPiWm5NcsSGe06c8DZZhzTCAmfrwyob-i-6zIOujSds0vmAJqIHtyXOpp1Y-KDajRmn4s3pnjtR5x1XjE9K-2qZfGWjzrc2_z8DXwFA4MXRP9f4eII1DmjQyQN-IZJ5I4IXVqw-4dX2BeCI7cwfqBbVX5AaJjcy6OIWremJ8syDohRlK7SDEUQuKwHcfxhaM40rgKwA_UWbb1GDicJbJTLNcHJoLSQ6P68axoAuL0aXMLoTmm'
    },
    {
      id: 2,
      name: 'Quantum Leap Corp.',
      status: 'Profile Complete',
      statusColor: 'text-green-600 dark:text-green-400',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCkmS226JqWx7RInuqASl4uVY19SzH9EhNzxCElXmwyIbvtQYotRNY8-MCDbNGbtSaiug-lUgHazLbHIA-ZidKHiNYMdqOQyu3y_F35N9I06A5E_QwfEBd9CTHxuwguj0F4mr4JPcto79v9FLi6u8kP2timdBFPY-xUiM3-G3STTCX5-NauTTwJ6LZPmhb_nW9PC-Pd_pde02F26Gu9FStdT6I50elHzVlzGz8saKL5kEjjQKoAVR0Urd09YaKWlTZ4CKohevdcDrJy'
    },
    {
      id: 3,
      name: 'Starlight Cafe',
      status: '3 New Reviews',
      statusColor: 'text-amber-600 dark:text-amber-400',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZd-asXdwd0z8ezaI0j9N3ydYbqwG8H0l4EMfuLA__Bt8qt370ezcbh5NSWsOU2Kuqk6N_D3Zg4q-YcONSvlggvcAP78A0406JPZrN1Fal_Bm6kayjWe7kBCzd7qXzP3Fc7VjA8u-77Udos3h2aGKRGoSFTHQt9s0v-ty77_Ui6ArmGnZPa5QeqEHMnS8TWL0gRpfy0FG9RIhL7dVOXsrkEMYUGnRWhuViqITc25jvdJoWXyXyKv4k_WmkxF_Suh-FnZyfMhXxlxk4'
    },
    {
      id: 4,
      name: 'The Daily Bread',
      status: 'No recent activity',
      statusColor: 'text-gray-500 dark:text-gray-400',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0zAij3UqpXQDe5L9ekSN5RI5l3VXKRj_twaG80ZL2ZPmcOjEub1mezyOC34NH78fxN2QFmHUesBU56rskk-XWXoeXV2MZaJ2lJC2yr16dMHMPJ1dcJo_Y_u5ZgY8bXZsM0i7HhphZuoJjDlgy1xg4Uzl3-Iwwb5h_mgE93YMvIcu_C3UFPq8ZxdqlaZJ9aUuDIwJGJS4gdapzCLJvMwChaEn7P6xizqVrM51RzfuXymwCit1VEoEsiWMfRhWfa1j86MS3XCZqebOS'
    }
  ]);

  readonly orders = signal<Order[]>([
    {
      id: '#17345',
      productName: 'Headphones',
      productImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZCOIZIDEYmQOP_e3QonZ_VOziQSn9LBx90zcx9T-L2D9CrPmgk5BJsf0yHY71N1O9PLEo1TNyVfBOz5foSPkRQmnwUa27ebZ_75AreEXG8s-N5fHkxUOhZmRMXE2eeV2zx3t02-pRBB1rr4ZjRlkUuydthTmJJnlxAaafIYl2tf4M0siJ5OWXGW34R5VPsYTw6r_9MvW5L460nU-v4jws373r--iw4iKpFuPfwGMAzTGw3SXdtBsDBin8Mtd7jN6vrAxkTM1FKQbn',
      customer: 'Liam Johnson',
      date: 'June 1, 2023',
      total: '$299.99',
      status: 'Shipped'
    },
    {
      id: '#17346',
      productName: 'Smartwatch',
      productImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOzVoBPCzAwa_PxVgk0YPkCYH0FxMbzCnJUbIZjREPg0G-4zjtpuMR7UM2PUy0vDm3cLnHpCBaRXOxS72tbhdV6bjl0Bhy0xkEIBuKt_H6yu_YMJCvE-cnnN6kdHyG1WRXldNlgJCuDzmYasR60A7-_GbCySyu-I_FHbG-owPz0xKcu8HX0TNDbRiEjIk2o2p0CDYzVNSQwuMEFVl4PdiH8vWbzZnb2PfAcRgY_jR4UYqBYBdA_SZ6B3hW_bZwi8AEpoh9NKUY8uRD',
      customer: 'Olivia Smith',
      date: 'May 30, 2023',
      total: '$199.50',
      status: 'Delivered'
    },
    {
      id: '#17347',
      productName: 'Laptop',
      productImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1xG9vCwleK0gyTRvQ_g8xuqE5WcwoXUCPRfB1aie__xQVsNk3lfAPfk8e7r_30aYjR9WyXStBwLPjy9_wdUTmK3xtfU-EPQN3BRXDcXykItcyP1S0mYka4NqtlQZMNbUWDYEv40fqeSU3Jv8lxjjtUQdN38nGioV78HxQSTTSTeIfIIQAuu1sqyN2oaoikCHHFSyoGfh7mOUcgJvLnhMMmRlS7Ogr_zeg2sHjzZ7jpGGrj_p6Gl_wYRBKrRPe7Qr8xJSKARRK4RZ2',
      customer: 'Noah Brown',
      date: 'May 28, 2023',
      total: '$749.00',
      status: 'Processing'
    },
    {
      id: '#17348',
      productName: 'Speaker',
      productImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArpwtXDJ4TEV9XFxfLFx6B-mBiKo44FmAZDQTt9qTOKp9GyLNbh8grLRqAA8C4qFy2LduGxRbPwk5PxHBD0umW_NfRxafSvQqNyEnF_KW2mwTgDZIJVzbUyWcyRmA2ociMs6xz4VEUe5j5WZiO0qpo_sYdf_nL6ibHJ01cDoUpQo_F3khozEsXKN6Y0WOSk30p61VJuG50HhdCo0klsnQR9P3wbsxShghSvJzYyfwtwEpwcaJXC1AWdJhp5ys0-1QAUKyYbWEZoMav',
      customer: 'Emma Davis',
      date: 'May 25, 2023',
      total: '$150.00',
      status: 'Canceled'
    },
    {
      id: '#17349',
      productName: 'Camera',
      productImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBT2b8ijmaDEhjSRSGHG2E_alqFzH5giZ2ya7ZJJaLwTmQ6fKya56Iq1opb3PWITBue2LKDmgC0ONni5ILCyAQw1ohNfal_0Psc7X197OuDvZuOXz2Z9Ugu8XxN_BNWidIvsVtCT4MsFweXQ3DpX1eH3EGQjbSga1oot9vftjq-pPeY1E8JHa7ntvATp78e0XpLl53g9xADLPjtcQ2kRsVnVxcj6AxZ4pKfofyNDpbHosYqudSraZOWvcZKDyO7a4PVAoksy5pDJ1V4',
      customer: 'Ava Wilson',
      date: 'May 22, 2023',
      total: '$1,299.00',
      status: 'Shipped'
    }
  ]);

  deleteBusiness(id: number) {
    this.businesses.update(list => list.filter(b => b.id !== id));
  }
}