import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosPedidoComponent } from './productos-pedido.component';

describe('ProductosPedidoComponent', () => {
  let component: ProductosPedidoComponent;
  let fixture: ComponentFixture<ProductosPedidoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductosPedidoComponent]
    });
    fixture = TestBed.createComponent(ProductosPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
