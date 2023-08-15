import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MayoresProductosComponent } from './mayores-productos.component';

describe('MayoresProductosComponent', () => {
  let component: MayoresProductosComponent;
  let fixture: ComponentFixture<MayoresProductosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MayoresProductosComponent]
    });
    fixture = TestBed.createComponent(MayoresProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
