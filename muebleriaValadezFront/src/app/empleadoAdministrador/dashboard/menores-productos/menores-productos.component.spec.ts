import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenoresProductosComponent } from './menores-productos.component';

describe('MenoresProductosComponent', () => {
  let component: MenoresProductosComponent;
  let fixture: ComponentFixture<MenoresProductosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenoresProductosComponent]
    });
    fixture = TestBed.createComponent(MenoresProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
