import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Product } from '../models/product';
import { take, map } from 'rxjs/operators';
import { ShoppingCart } from '../models/shopping-cart';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  constructor(private db:AngularFirestore) { }

  async getCart(): Promise<Observable<ShoppingCart>>{
    let cartId = await this.getOrCreateCartId();
    return this.db.collection('shopping-cart').doc(cartId).collection('items').snapshotChanges()
    .pipe(
      map(x => new ShoppingCart(x as any)
      ));
  }

  async addToCart(product: Product){
    this.updateItemQuantity(product, 1);
  }

  async removeFromCart(product: Product) {
    this.updateItemQuantity(product, -1);
  }

  async clearCart() {
    let cartId  = await this.getOrCreateCartId();
    this.db.collection('shopping-cart').doc(cartId).collection('items').snapshotChanges().pipe(take(1))
      .subscribe(products => { products.map(productItem => 
        this.db.collection('shopping-cart').doc(cartId).collection('items').doc(productItem.payload.doc.id).delete()
        );
    });
  }

  private create() {
    return this.db.collection('/shopping-cart').add({
      dateCreated: new Date().getTime()
    });
  }

  private getItem(cartId, productId) {
    return this.db.collection('/shopping-cart/').doc(cartId).collection('items').doc(productId);
  }

  private async getOrCreateCartId() {
    let cartId = localStorage.getItem('cartId');
    if (!cartId) {
      let result = await this.create();
      localStorage.setItem('cartId', result.id);
      return result.id;
    }

    return cartId;
  }

  private async updateItemQuantity(product: Product, change: number) {

    let cartId = await this.getOrCreateCartId();
    let item$ = this.getItem(cartId, product.key);
    
    item$.valueChanges().pipe(take(1)).subscribe((item:any) => {
           
      if(!item) {
        item$.set({
          product: product,
          quantity: 1
        });
      } else {
        const quantity = item.quantity + change;
        if (quantity === 0) {
          item$.delete(); 
        } else {
          item$.update({ 
            quantity: quantity 
          }); 
        }
      }
    });

  }

}
