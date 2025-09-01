import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
  UserCredential,
  setPersistence,
  browserLocalPersistence
} from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser = new BehaviorSubject<User | null>(null);
  user$ = this.currentUser.asObservable();

  constructor(private auth: Auth) {
    setPersistence(this.auth, browserLocalPersistence)
      .then(() => {
        console.log('Firebase Auth persistence set to local.');
        onAuthStateChanged(this.auth, user => {
          this.currentUser.next(user);
        });
      })
      .catch(error => {
        console.error('Error al configurar la persistencia de Firebase Auth:', error);
        onAuthStateChanged(this.auth, user => {
          this.currentUser.next(user);
        });
      });
  }

  async register(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  async login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout(): Promise<void> {
    return signOut(this.auth);
  }

  getUser() {
    return this.currentUser.value;
  }

  isLoggedIn(): boolean {
    return this.currentUser.value !== null;
  }
}
