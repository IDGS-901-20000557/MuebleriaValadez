import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MejoresClientesComponent } from './mejores-clientes.component';

describe('MejoresClientesComponent', () => {
  let component: MejoresClientesComponent;
  let fixture: ComponentFixture<MejoresClientesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MejoresClientesComponent]
    });
    fixture = TestBed.createComponent(MejoresClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
