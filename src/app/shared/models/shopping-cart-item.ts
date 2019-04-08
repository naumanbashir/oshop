import { Product } from './product';


export class ShoppingCartItem {


    constructor(public product: Product, public quantity: number, public key: string) {

    }

    get totalPrice() { return this.quantity * this.product.price; }
}