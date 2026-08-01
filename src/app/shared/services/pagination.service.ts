import { HttpClient, HttpParams } from "@angular/common/http";
import { computed, inject, Injectable, signal } from "@angular/core";
import { finalize } from "rxjs";

export interface PaginationInfo {
  pageIndex: number;
  pageSize: number;
}

export interface PagedResult<TModel>{
  items: TModel[];
  totalCount: number;
}

export interface PageRequest<TFilter> {
  endpoint: string,
  filter?: TFilter
}

@Injectable()
export class PaginationService<TModel, TFilter> {
  private readonly http = inject(HttpClient);

  readonly loading = signal(false);
  readonly items = signal<TModel[]>([]);
  readonly totalCount = signal<number>(0);

  private readonly _pageIndex = signal<number>(0);
  private readonly _pageSize = signal<number>(10);
  readonly pageIndex = this._pageIndex.asReadonly();
  readonly pageSize = this._pageSize.asReadonly();

  readonly totalPages = computed(() => 
    Math.max(1, Math.ceil(this.totalCount() / this._pageSize()))
  );
  readonly hasPrevious = computed(() => this._pageIndex() > 0);
  readonly hasNext = computed(() => this._pageIndex() < this.totalPages() - 1);
  readonly isEmpty = computed(() =>
    !this.loading() && this.items().length === 0
  );

  private filter = {} as TFilter;
  private request!: PageRequest<TFilter>;

  configure(request: PageRequest<TFilter>): this {
    this.request = request;
    if(request.filter) this.filter = request.filter;
    return this; 
  }

  load() {  
    if(!this.request)
      throw new Error("Request não configurada");
  
    this.loading.set(true);

    const params = this.buildParams();
  
    this.http
      .get<any>(this.request.endpoint, { params })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe(raw => {
        this.items.set(raw.items);
        this.totalCount.set(raw.totalCount);
      });
  }

  reaload(){
    this.load();
  }

  goToPage(index: number) {
    if(index < 0 || index >= this.totalPages() || index === this._pageIndex())
      return;

    this._pageIndex.set(index);
    this.load();
  }

  next(){
    if(this.hasNext())
      this.goToPage(this._pageIndex() + 1);
  }

  previous(){
    if(this.hasPrevious())
      this.goToPage(this._pageIndex() - 1);
  }

  setPageSize(size: number) {
    this._pageSize.set(size);
    this._pageIndex.set(0);
    this.load();
  }

  applyFilter(filter: TFilter){
    this.filter = filter;
    this._pageIndex.set(0);
    this.load();
  }

  private buildParams(): HttpParams {
    let params = new HttpParams()
      .set("pageIndex", this._pageIndex().toString())
      .set("pageSize", this._pageSize().toString());
  
    Object.entries(this.filter as Record<string, unknown>).forEach(
      ([key, value]) => {
        if(!value) return;

        if(Array.isArray(value)){
          value.forEach(v => params = params.append(key, String(v)));
          return;
        } 

        params = params.set(key, String(value));
      }
    );

    return params;
  }
}