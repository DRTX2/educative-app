import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FeedbackService } from './services/feedback.service';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-feedback-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [FeedbackService],
  templateUrl: './feedback-modal.component.html',
  styleUrl: './feedback-modal.component.scss',
})
export class FeedbackModalComponent {
  @Input() show = false;
  @Output() closed = new EventEmitter<void>();

  rating = 0;
  comment = '';
  isSubmitting = false;

  constructor(private feedbackService: FeedbackService, private toast: HotToastService) {}

  async submit() {
    if (this.rating === 0) return;

    this.isSubmitting = true;
    try {
      await this.feedbackService.saveFeedback(this.rating, this.comment);
      this.toast.success('✓ Gracias por tu retroalimentación');
      this.close();
    } catch (error) {
      this.toast.error('✗ Error al guardar retroalimentación');
      console.error(error);
    } finally {
      this.isSubmitting = false;
    }
  }

  skip() {
    this.close();
  }

  close() {
    this.rating = 0;
    this.comment = '';
    this.show = false;
    this.closed.emit();
  }

  getEmoji(rating: number): string {
    const emojis: Record<number, string> = {
      1: '😞',
      2: '😕',
      3: '😐',
      4: '🙂',
      5: '😄',
    };
    return emojis[rating] || '';
  }

  getRatingLabel(rating: number): string {
    const labels: Record<number, string> = {
      1: 'Muy difícil',
      2: 'Difícil',
      3: 'Normal',
      4: 'Fácil',
      5: 'Muy fácil',
    };
    return labels[rating] || '';
  }
}
