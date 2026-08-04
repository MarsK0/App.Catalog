import { NgClass, NgTemplateOutlet } from '@angular/common';
import { Component, computed, contentChild, contentChildren, inject, input, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowDown, lucideArrowUp, lucideArrowUpDown, lucideChevronDown } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmTableImports } from '@spartan-ng/helm/table';
import {
  type ColumnDef,
  type ColumnFiltersState,
  createAngularTable,
  getCoreRowModel,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
} from '@tanstack/angular-table';

import { DataTableColumnDef, DataTableRowActionsDef } from '../../directives/data-table.directive';
import { PaginationService } from '../../services/pagination.service';
import { HlmNumberedPagination } from '@spartan-ng/helm/pagination';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [NgTemplateOutlet, NgClass, FormsModule, NgIcon, HlmButtonImports, HlmDropdownMenuImports, HlmInputImports, HlmTableImports, HlmNumberedPagination],
  providers: [provideIcons({ lucideChevronDown, lucideArrowUpDown, lucideArrowUp, lucideArrowDown })],
  host: { class: 'block w-full' },
  templateUrl: './data-table.component.html',
})
export class DataTable<TModel extends Record<string, any>> implements OnInit {
  readonly data = input.required<TModel[]>();
  readonly selectable = input(false);

  protected readonly columnDefs = contentChildren(DataTableColumnDef<TModel>);
  protected readonly rowActionsDef = contentChild(DataTableRowActionsDef);
  protected table!: ReturnType<typeof createAngularTable<TModel>>;

  protected readonly pagination = inject(PaginationService);

  protected readonly sorting = signal<SortingState>([]);
  private readonly _columnFilters = signal<ColumnFiltersState>([]);
  private readonly _columnsVisibility = signal<VisibilityState>({});
  private readonly _rowSelection = signal<RowSelectionState>({});

  /** coluna sendo arrastada agora, só pra feedback visual (highlight da alça) */
  protected readonly resizingColumnId = signal<string | null>(null);

  private readonly _columnDefMap = computed(() => new Map(this.columnDefs().map((def) => [def.name, def] as const)));

  protected readonly columns = computed<ColumnDef<TModel>[]>(() =>
    this.columnDefs().map((def) => ({
      id: def.name,
      accessorKey: def.name,
      header: def.label ?? def.name,
      enableSorting: def.sortable,
      enableHiding: def.hideable,
    })),
  );

  ngOnInit(): void {
    this.table = createAngularTable<TModel>(() => ({
      data: this.data(),
      columns: this.columns(),
      manualPagination: true,
      manualSorting: true,
      enableColumnResizing: true,
      pageCount: Math.ceil(this.pagination.totalCount() / (this.pagination.pageSize() || 10)),
      state: {
        sorting: this.sorting(),
        columnFilters: this._columnFilters(),
        columnVisibility: this._columnsVisibility(),
        rowSelection: this._rowSelection(),
        pagination: {
          pageIndex: this.pagination.pageIndex(),
          pageSize: this.pagination.pageSize(),
        },
      },
      onSortingChange: (updater) => {
        const currentSorting = this.pagination.sorting();
        const nextSorting = typeof updater === 'function' ? updater(currentSorting) : updater;
        this.pagination.setSorting(nextSorting);
      },
      onPaginationChange: (updater) => {
        const current = {
          pageIndex: this.pagination.pageIndex(),
          pageSize: this.pagination.pageSize(),
        };

        const nextPage = typeof updater === 'function' ? updater(current) : updater;

        this.pagination.setPageIndex(nextPage.pageIndex);
        this.pagination.setPageSize(nextPage.pageSize);
      },
      onColumnVisibilityChange: (updater) => {
        this._columnsVisibility.update((prev) => (typeof updater === 'function' ? updater(prev) : updater));
      },
      getCoreRowModel: getCoreRowModel(),
    }));
  }

  protected readonly hidableColumns = computed(() => this.table.getAllColumns().filter((f) => f.getCanHide()));
  protected readonly columnSpan = computed(() => this.columns().length + (this.selectable() ? 1 : 0) + (this.rowActionsDef() ? 1 : 0));

  protected columnDefFor(id: string): DataTableColumnDef | undefined {
    return this._columnDefMap().get(id);
  }

  protected alignClass(columnId: string): Record<string, boolean> {
    const align = this.columnDefFor(columnId)?.align;
    return { 'text-right': align === 'right', 'text-center': align === 'center' };
  }

  protected onPageSizeChange(size: number) {
    this.pagination.setPageSize(size);
  }
}