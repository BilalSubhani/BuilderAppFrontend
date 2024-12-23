import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegrateComponent } from './integrate.component';

describe('IntegrateComponent', () => {
  let component: IntegrateComponent;
  let fixture: ComponentFixture<IntegrateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntegrateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntegrateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
