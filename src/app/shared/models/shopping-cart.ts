import { ShoppingCartItem } from './shopping-cart-item';
import { Product } from './product';

export class ShoppingCart {

    items: ShoppingCartItem[] = [];
    
    constructor(public itemsMap: { [productId: string]: ShoppingCartItem}){
        for (let productId in itemsMap) {
            let item = itemsMap[productId] as any;
            this.items.push(new ShoppingCartItem(item.payload.doc.data().product, item.payload.doc.data().quantity,
            item.payload.doc.data().product.key));
        }
    }

    get totalPrice() {
        let sum = 0;
        for (let productId in this.items)
            sum += this.items[productId].totalPrice;
        return sum;
    }

    get totalItemsCount() {
        let count = 0;
        for (let productId in this.items)
            count += this.items[productId].quantity;
        return count;
    }

    getQuantity(product: Product) {
        let quant = 0;
        this.items.forEach(element => {
           if (element.key === product.key) {
            quant = element.quantity;
          }
        });
        return quant;
    }
}