import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  productDoc: AngularFirestoreDocument<Product>;

  constructor(private db: AngularFirestore) { }

  create(product){
    this.db.collection('products').add(product);
  }

  getAll() {
    return this.db.collection<Product>('products').snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => ({ key: a.payload.doc.id, ...a.payload.doc.data() }))
        )
      ); 
  }

  getProduct(productId: string) {
    return this.db.collection('products').doc(productId).valueChanges()
  }

  updateProduct(productId, product){
    return this.db.collection('products').doc(productId).update(product);
  }

  deleteProduct(productId) {
    return this.db.collection('products').doc(productId).delete();
  }
}
