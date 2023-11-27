import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventarioInsumosComponent } from './inventario-insumos.component';

describe('InventarioInsumosComponent', () => {
  let component: InventarioInsumosComponent;
  let fixture: ComponentFixture<InventarioInsumosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InventarioInsumosComponent]
    });
    fixture = TestBed.createComponent(InventarioInsumosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
