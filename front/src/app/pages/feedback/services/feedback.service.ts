import { Injectable } from '@angular/core';
import { IndexedDbService } from '@core/services/storage/indexeddb.service';
import { NetworkService } from '@core/services/network/network.service';
import { SyncService } from '@core/services/sync/sync.service';
import { HttpClient } from '@angular/common/http';
import { FeedbackEntity } from '@core/entities/feedback.entity';

@Injectable()
export class FeedbackService {
  private apiUrl = '/api/v1/feedback';

  constructor(
    private indexedDb: IndexedDbService,
    private network: NetworkService,
    private sync: SyncService,
    private http: HttpClient
  ) {}

  async saveFeedback(rating: number, comments: string, type: 'lesson' | 'task' | 'general' = 'general'): Promise<void> {
    const feedback = new FeedbackEntity({
      feedbackType: type,
      rating,
      comments: comments || null,
      metadata: {},
      synced: false,
    });

    // Guardar en IndexedDB
    const id = await this.indexedDb.add('feedback', feedback);

    // Si estamos online, enviar al backend
    if (this.network.isOnline) {
      try {
        await this.http
          .post(this.apiUrl, {
            feedbackType: type,
            rating,
            comments,
          })
          .toPromise();

        feedback.id = id;
        feedback.synced = true;
        await this.indexedDb.update('feedback', feedback);
      } catch (error) {
        // Si falla, agregar a cola de sincronización
        await this.sync.queueAction('POST', this.apiUrl, { rating, comments, feedbackType: type });
      }
    } else {
      // Agregar a cola de sincronización offline
      await this.sync.queueAction('POST', this.apiUrl, { rating, comments, feedbackType: type });
    }
  }

  async getMyFeedback(): Promise<FeedbackEntity[]> {
    return this.indexedDb.getAll<FeedbackEntity>('feedback');
  }
}
