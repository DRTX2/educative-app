import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexedDbService } from '@core/services/storage/indexeddb.service';
import { FeedbackEntity } from '@core/entities/feedback.entity';
import { FeedbackModalComponent } from './feedback-modal.component';

@Component({
  selector: 'app-feedback-page',
  standalone: true,
  imports: [CommonModule, FeedbackModalComponent],
  templateUrl: './feedback-page.component.html',
  styleUrl: './feedback-page.component.scss',
})
export class FeedbackPageComponent implements OnInit {
  feedbackEntries: FeedbackEntity[] = [];
  averageRating = 0;
  isLoading = true;
  showModal = false;

  constructor(private readonly indexedDb: IndexedDbService) {}

  async ngOnInit(): Promise<void> {
    await this.indexedDb.init();
    await this.loadFeedback();
  }

  async loadFeedback(): Promise<void> {
    try {
      const feedback = await this.indexedDb.getAll<FeedbackEntity>('feedback');
      this.feedbackEntries = feedback
        .map((entry) => new FeedbackEntity(entry))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      this.averageRating = this.feedbackEntries.length
        ? Number(
            (
              this.feedbackEntries.reduce((sum, entry) => sum + entry.rating, 0) /
              this.feedbackEntries.length
            ).toFixed(1),
          )
        : 0;
    } finally {
      this.isLoading = false;
    }
  }

  countByType(type: FeedbackEntity['feedbackType']): number {
    return this.feedbackEntries.filter((entry) => entry.feedbackType === type).length;
  }

  trackById(_: number, item: FeedbackEntity): number | undefined {
    return item.id;
  }

  openFeedback(): void {
    this.showModal = true;
  }

  async handleModalClosed(): Promise<void> {
    this.showModal = false;
    await this.loadFeedback();
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  getTone(rating: number): string {
    if (rating >= 4) return 'Esperanzador';
    if (rating === 3) return 'Neutral';
    return 'Necesita apoyo';
  }
}
