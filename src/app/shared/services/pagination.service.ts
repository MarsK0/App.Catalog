import { Injectable, computed, signal } from "@angular/core";

export interface SortParam {
  id: string;
  desc: boolean;
}

@Injectable()
export class PaginationService {
  protected readonly _pageIndex = signal<number>(0);
  protected readonly _pageSize = signal<number>(10);
  protected readonly _totalCount = signal<number>(0);
  protected readonly _sorting = signal<SortParam[]>([]);

  readonly pageIndex = this._pageIndex.asReadonly();
  readonly pageSize = this._pageSize.asReadonly();
  readonly sorting = this._sorting.asReadonly();
  readonly totalCount = this._totalCount.asReadonly();

  readonly pageCount = computed(() => {
    const size = this._pageSize();
    return size > 0 ? Math.max(1, Math.ceil(this._totalCount() / size)) : 0;
  });

  readonly hasPrevious = computed(() => this._pageIndex() > 0);
  readonly hasNext = computed(() => this._pageIndex() < this.pageCount() - 1);
  readonly rangeStart = computed(() => (this._totalCount() === 0 ? 0 : this._pageIndex() * this._pageSize() + 1));
  readonly rangeEnd = computed(() => Math.min((this._pageIndex() + 1) * this._pageSize(), this._totalCount()));

  setTotalCount(count: number){
    this._totalCount.set(count);
    if(this._pageIndex() > this.pageCount() - 1){
      this._pageIndex.set(Math.max(0, this.pageCount() - 1));
    }
  }

  setPageSize(size: number){
    this._pageSize.set(size);
    this._pageIndex.set(0);
  }

  setPageIndex(index: number){
    const clamped = Math.min(Math.max(0, index), Math.max(0, this.pageCount() - 1));
    this._pageIndex.set(clamped);
  }

  setSorting(sorting: SortParam[]){
    this._sorting.set(sorting);
  }

  clearSorting(){
    this._sorting.set([]);
  }

  nextPage(){
    if(this.hasNext())
      this._pageIndex.update(i => i + 1);
  }
  previousPage(){
    if(this.hasPrevious())
      this._pageIndex.update(i => Math.max(0, i - 1));
  }
  firstPage(){
    this._pageIndex.set(0);
  }
  lastPage(){
    this._pageIndex.set(Math.max(0, this.pageCount() - 1));
  }
}