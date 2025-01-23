import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEdtCategoryComponent } from './add-edt-category.component';

describe('AddEdtCategoryComponent', () => {
  let component: AddEdtCategoryComponent;
  let fixture: ComponentFixture<AddEdtCategoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEdtCategoryComponent]
    });
    fixture = TestBed.createComponent(AddEdtCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
