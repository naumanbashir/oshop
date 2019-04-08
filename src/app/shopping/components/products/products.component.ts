import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../shared/services/product.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../shared/models/product';
import { switchMap } from 'rxjs/operators';
import { ShoppingCartService } from '../../../shared/services/shopping-cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[];
  category: string;
  cart: any;
  subscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private shoppingCartService: ShoppingCartService
    ) {

      productService.getAll().pipe(switchMap(products => {
        this.products = products;
          return route.queryParamMap
        }))
        .subscribe(params => {
          this.category = params.get('category');
  
          this.filteredProducts = (this.category) ?
          this.products.filter( p => p.category === this.category) : 
          this.products;
      });

    }

  async ngOnInit() {
    this.subscription = (await this.shoppingCartService.getCart())
      .subscribe(cart => { this.cart = cart });  
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
