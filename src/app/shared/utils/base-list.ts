import { HttpClient, HttpParams } from "@angular/common/http";
import { Directive, effect, inject, signal, untracked } from "@angular/core";
import { PaginationService, SortParam } from "../services/pagination.service";
import { finalize } from "rxjs";

@Directive()
export abstract class BaseList<TModel, TFilter>{
  private readonly http = inject(HttpClient);
  private readonly pagination = inject(PaginationService);
  
  private filter = {} as TFilter;

  readonly loading = signal<boolean>(false);
  readonly items = signal<TModel[]>([]);

  constructor(private readonly endpoint: string){
    effect(() => {
      this.pagination.pageIndex();
      this.pagination.pageSize();
      this.pagination.sorting();

      untracked(() => this.load());
    });
  }

  load() {
    this.loading.set(true);
    
    const params = this.buildParams();

    this.http
      .get<any>(this.endpoint, { params })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe(raw => {
        this.items.set(raw.items);
        this.pagination.setTotalCount(raw.totalCount);
      });
  }

  applyFilter(filter: TFilter){
    this.filter = filter;
    this.pagination.setPageIndex(0);
    this.load();
  }

  private buildParams(): HttpParams {
    let params = new HttpParams()
      .set('pageIndex', this.pagination.pageIndex().toString())
      .set('pageSize', this.pagination.pageSize().toString());

    const sorting = this.pagination.sorting();
    if(sorting.length > 0){
      sorting.forEach((sort, index) => {
        params = params
          .set(`Sort[${index}].Field`, sort.id)
          .set(`Sort[${index}].Desc`, sort.desc.toString());
      });
    }

    Object.entries(this.filter as Record<string, unknown>).forEach(
      ([key, value]) => {
        if(!value)
          return;

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