import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private db: AngularFirestore) { }

  getAll() {
    return this.db.collection('/categories', ref => ref.orderBy('name')).snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => ({ key: a.payload.doc.id, ...a.payload.doc.data() }))
        )
      );
  }
}
