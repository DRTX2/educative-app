import { Injectable } from '@angular/core';
import { IndexedDbService } from '../storage/indexeddb.service';
import { NetworkService } from '../network/network.service';
import { HttpClient } from '@angular/common/http';
import { HotToastService } from '@ngxpert/hot-toast';

export interface SyncQueueItem {
  id?: number;
  action: 'POST' | 'PUT' | 'DELETE';
  url: string;
  data?: any;
  timestamp: number;
  retries: number;
}

@Injectable({
  providedIn: 'root',
})
export class SyncService {
  private isSyncing = false;

  constructor(
    private indexedDb: IndexedDbService,
    private network: NetworkService,
    private http: HttpClient,
    private toast: HotToastService
  ) {
    // Escuchar cuando vuelve la conexión
    this.network.online$.subscribe((isOnline) => {
      if (isOnline && !this.isSyncing) {
        this.syncPendingActions();
      }
    });
  }

  async queueAction(action: 'POST' | 'PUT' | 'DELETE', url: string, data?: any): Promise<void> {
    const queueItem: SyncQueueItem = {
      action,
      url,
      data,
      timestamp: Date.now(),
      retries: 0,
    };

    await this.indexedDb.add('sync_queue', queueItem);
  }

  async syncPendingActions(): Promise<void> {
    if (this.isSyncing || this.network.isOffline) {
      return;
    }

    this.isSyncing = true;

    try {
      const queue = await this.indexedDb.getAll<SyncQueueItem>('sync_queue');

      if (queue.length === 0) {
        this.isSyncing = false;
        return;
      }

      let successCount = 0;

      for (const item of queue) {
        try {
          switch (item.action) {
            case 'POST':
              await this.http.post(item.url, item.data).toPromise();
              break;
            case 'PUT':
              await this.http.put(item.url, item.data).toPromise();
              break;
            case 'DELETE':
              await this.http.delete(item.url).toPromise();
              break;
          }

          // Si tiene éxito, eliminar de la cola
          if (item.id) {
            await this.indexedDb.delete('sync_queue', item.id);
            successCount++;
          }
        } catch (error) {
          console.error('Error syncing item:', error);
          // Incrementar contador de reintentos
          if (item.id) {
            item.retries++;
            if (item.retries < 3) {
              await this.indexedDb.update('sync_queue', item);
            } else {
              // Después de 3 intentos, eliminar de la cola
              await this.indexedDb.delete('sync_queue', item.id);
            }
          }
        }
      }

      if (successCount > 0) {
        this.toast.success(`${successCount} acciones sincronizadas`);
      }
    } finally {
      this.isSyncing = false;
    }
  }
}
