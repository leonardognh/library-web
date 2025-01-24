import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DropdownService {
  private dropdownState = new Subject<string>();

  dropdownState$ = this.dropdownState.asObservable();

  toggleDropdown(instanceId: string): void {
    this.dropdownState.next(instanceId);
  }
}
