import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEdtBookComponent } from './add-edt-book.component';

describe('AddEdtBookComponent', () => {
  let component: AddEdtBookComponent;
  let fixture: ComponentFixture<AddEdtBookComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEdtBookComponent]
    });
    fixture = TestBed.createComponent(AddEdtBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
