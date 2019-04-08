import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../shared/services/category.service';
import { ProductService } from '../../shared/services/product.service';
import { Router, ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  categories$;
  product = {};
  id;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private categoryService: CategoryService, 
    private productService: ProductService) { 
    this.categories$ = categoryService.getAll();

    this.getProduct();
  }

  getProduct() {
    this.id = this.route.snapshot.paramMap.get('id');
    if(this.id) {
      return this.productService.getProduct(this.id).pipe(take(1)).subscribe(p => { this.product = p });
    }
  }

  save(product) {
    if(this.id) this.productService.updateProduct(this.id, product);
    else this.productService.create(product);

    this.router.navigate(['/admin/products']);
  }

  deleteProduct() {
    if(!confirm('Are you sure you want to delete this prodcut')) return;
      
    this.productService.deleteProduct(this.id);
    this.router.navigate(['/admin/products']);
  }

  ngOnInit() {
  }



}
