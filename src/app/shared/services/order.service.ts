import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Order } from '../models/order';
import { ShoppingCartService } from './shopping-cart.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private db: AngularFirestore, private shoppingCartService: ShoppingCartService) { }

  async placeOrder(order: Order) {
    let orderObj = {
      userId: order.userId,
      datePlaced: order.datePlaced,
      shipping: order.shipping,
      items: order.items
    };
    let result = await this.db.collection('/orders').add(orderObj);
    this.shoppingCartService.clearCart();
    return result;
  }

  getOrders() {
    return this.db.collection('orders').snapshotChanges();
  }

  getOrdersByUser(userId: string) {
    return this.db.collection('orders', ref => ref.where('userId', '==', userId)).snapshotChanges();
  }
}
