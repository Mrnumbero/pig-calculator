import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  serverTimestamp,
} from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class CvService {
  private ref;

  constructor(private firestore: Firestore) {
    this.ref = collection(this.firestore, 'cvSubmissions');
  }

  saveCv(cvCode: string, salesId: string) {
    return addDoc(this.ref, {
      cvCode,
      salesId,
      createdAt: serverTimestamp(),
    });
  }

  async testConnection() {
    return addDoc(this.ref, {
      test: true,
      createdAt: serverTimestamp(),
    });
  }
}
