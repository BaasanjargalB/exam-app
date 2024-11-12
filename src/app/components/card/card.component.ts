import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  @Input() exam: any;

  constructor(private router: Router) {}

  onGetDetail() {
    this.router.navigate(['/details'], {
      queryParams: { id: this.exam['_id'] },
    });
  }
}
