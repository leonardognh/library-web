import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  OnInit,
  inject,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  Validators,
} from '@angular/forms';
import { Option } from '../../models/options.models';
import { DropdownService } from './services/dropdown.service';

@Component({
  selector: 'app-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiSelectComponent),
      multi: true,
    },
  ],
})
export class MultiSelectComponent
  implements OnInit, OnChanges, ControlValueAccessor
{
  @Input() set options(value: Option[]) {
    if (value && value.length > 0) {
      this._options = value;
      this.filteredOptions = [...this._options];
    }
  }
  @Input() dropdownTitle: string = 'Selecionar Opções';
  @Input() searchPlaceholder: string = 'Buscar...';
  @Input() pageSize: number = 20;
  @Input() totalPages: number = 5;
  @Input() triggerTouched: boolean = false;

  @Output() selectionChange = new EventEmitter<Option[]>();
  @Output() loadMore = new EventEmitter<number>();
  private dropdownService = inject(DropdownService);
  private _options: Option[] = [];
  filteredOptions: Option[] = [];
  selectedOptions: Option[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  loading: boolean = false;
  dropdownOpen: boolean = false;

  control = new FormControl<Option[]>([], [Validators.required]);
  instanceId: string = '';

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit(): void {
    this.instanceId = this.generateInstanceId();

    if (this.options && this.options.length > 0)
      this.filteredOptions = [...this.options];

    this.dropdownService.dropdownState$.subscribe((id) => {
      if (id !== this.instanceId && this.dropdownOpen) {
        this.closeDropdown();
      }
    });

    this.control.valueChanges.subscribe((selected: any) => {
      this.selectedOptions = selected || [];
      this.selectionChange.emit(this.selectedOptions);
      this.onChange(this.selectedOptions);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['triggerTouched'] && changes['triggerTouched'].currentValue) {
      this.setTouched();
    }
  }

  writeValue(value: Option[]): void {
    if (value) {
      this.selectedOptions = value;
      this.control.setValue(value, { emitEvent: false });
    } else {
      this.selectedOptions = [];
      this.control.setValue([], { emitEvent: false });
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setTouched(): void {
    this.control.markAsTouched();
  }

  toggleDropdown(): void {
    if (!this.dropdownOpen) {
      this.dropdownService.toggleDropdown(this.instanceId);
    }
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown(): void {
    this.dropdownOpen = false;
    this.setTouched();
  }

  onSearch(): void {
    this.filteredOptions = this.options.filter((option) =>
      option.label.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  onScroll(event: Event): void {
    const target = event.target as HTMLElement;
    const atBottom =
      target.scrollHeight - target.scrollTop === target.clientHeight;

    if (atBottom && !this.loading && this.currentPage < this.totalPages) {
      this.loading = true;
      this.currentPage++;
      this.loadMore.emit(this.currentPage);

      setTimeout(() => {
        this.loading = false;
      }, 1000);
    }
  }

  toggleSelection(option: Option): void {
    const currentSelections = this.control.value || [];
    if (this.isSelected(option)) {
      this.control.setValue(
        currentSelections.filter(
          (selected: Option) => selected.id !== option.id
        )
      );
    } else {
      this.control.setValue([...currentSelections, option]);
    }

    this.selectedOptions = this.control.value || [];
    this.selectionChange.emit(this.selectedOptions);
    this.onChange(this.selectedOptions);
  }

  isSelected(option: Option): boolean {
    return (
      this.control.value?.some(
        (selected: Option) => selected.id === option.id
      ) || false
    );
  }

  getSelectedLabels(): string {
    if (this.selectedOptions.length === 0) {
      return this.dropdownTitle;
    }
    return this.selectedOptions.map((option) => option.label).join(', ');
  }

  private generateInstanceId(): string {
    return Math.random().toString(36).slice(2, 11);
  }
}
