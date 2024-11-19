import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  @Input() exam: any;
  @Input() badgeValue: number = 0;

  constructor(private router: Router) { }

  onGetDetail() {
    if (this.exam['_id']) {
      this.router.navigate(['/details'], {
        queryParams: { id: this.exam['_id'] },
      });
    } else {
      this.router.navigate(['/exam']);
    }
  }
}
