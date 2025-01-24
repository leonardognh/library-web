import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  OnInit,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  Validators,
} from '@angular/forms';
import { Option } from '../../models/options.models';

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
export class MultiSelectComponent implements OnInit, ControlValueAccessor {
  @Input() set options(value: Option[]) {
    if (!value || (value && value.length === 0)) return;
    this._options = value;
    this.filteredOptions = [...this._options];
  }
  @Input() dropdownTitle: string = 'Selecionar Opções';
  @Input() searchPlaceholder: string = 'Buscar...';
  @Input() pageSize: number = 20;
  @Input() totalPages: number = 5;
  @Output() selectionChange = new EventEmitter<Option[]>();
  @Output() loadMore = new EventEmitter<number>();
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};
  private _options: Option[] = [];
  get options(): Option[] {
    return this._options;
  }
  filteredOptions: Option[] = [];
  control = new FormControl<Option[]>([], [Validators.required]);
  selectedOptions: Option[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  loading: boolean = false;
  dropdownOpen: boolean = false;

  ngOnInit(): void {
    this.filteredOptions = this.options;

    this.control.valueChanges.subscribe((selected: any) => {
      this.selectedOptions = selected;
      this.selectionChange.emit(this.selectedOptions);
    });
  }

  writeValue(value: any): void {
    if (value) {
      this.selectedOptions = value;
    } else {
      this.selectedOptions = [];
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown(): void {
    this.dropdownOpen = false;
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
  }

  isSelected(option: Option): boolean {
    return this.control.value?.some(
      (selected: Option) => selected.id === option.id
    )!;
  }

  getSelectedLabels(): string {
    return this.selectedOptions.map((option) => option.label).join(', ');
  }
}
