import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent, merge } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  private onlineSubject = new BehaviorSubject<boolean>(navigator.onLine);
  public online$ = this.onlineSubject.asObservable();

  constructor() {
    merge(
      fromEvent(window, 'online').pipe(map(() => true)),
      fromEvent(window, 'offline').pipe(map(() => false))
    ).subscribe((isOnline) => {
      this.onlineSubject.next(isOnline);
    });
  }

  get isOnline(): boolean {
    return this.onlineSubject.value;
  }

  get isOffline(): boolean {
    return !this.isOnline;
  }
}
