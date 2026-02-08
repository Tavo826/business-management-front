import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface Business {
  id: string;
  name: string;
  image: string;
  status: string;
  statusType: 'active' | 'complete' | 'reviews' | 'inactive';
}

@Component({
  selector: 'app-business',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './business.component.html',
  styleUrl: './business.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BusinessComponent {

  businesses = signal<Business[]>([
    {
      id: '1',
      name: 'Innovate Solutions Inc.',
      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop',
      status: '15 Active Orders',
      statusType: 'active'
    },
    {
      id: '2',
      name: 'Quantum Leap Corp.',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop',
      status: 'Profile Complete',
      statusType: 'complete'
    },
    {
      id: '3',
      name: 'Starlight Cafe',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
      status: '3 New Reviews',
      statusType: 'reviews'
    },
    {
      id: '4',
      name: 'The Daily Bread',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop',
      status: 'No recent activity',
      statusType: 'inactive'
    }
  ]);

  createBusiness() {
    console.log('Create new business');
    // Add logic to create a new business
  }

  deleteBusiness(id: string) {
    this.businesses.update(businesses => 
      businesses.filter(business => business.id !== id)
    );
  }

}
