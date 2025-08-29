import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private _isOpen$ = new BehaviorSubject<boolean>(false);

  get isOpen$(): Observable<boolean> {
    return this._isOpen$.asObservable().pipe(map(value => value || false));
  }

  open() {
    this._isOpen$.next(true);
  }

  close() {
    this._isOpen$.next(false);
  }
}
