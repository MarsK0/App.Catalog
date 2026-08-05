import { Directive, ContentChild, Input, TemplateRef, booleanAttribute } from "@angular/core";

// Contexto disponível dentro do `<ng-template dtCellDef let-row>`.
export interface DtCellContext<TModel = any>{
  $implicit: TModel;
  row: TModel;
  index: number;
}

// Contexto disponível dentro do `<ng-template dtHeaderCellDef>`.
export interface DtHeaderCellContext {
  $implicit: string;
  column: unknown;
}

/*
  Marca um `ng-template` como o corpo de uma célula de dados.
  Uso: `<ng-template dtCellDef let-row>{{ row.email }}</ng-template>`
*/
@Directive({
  selector: '[dtCellDef]',
  standalone: true
})
export class DataTabelCellDef<TModel = any> {
  constructor(public readonly template: TemplateRef<DtCellContext<TModel>>) {}

  static ngTemplateContextGuard<T>(
    dir: DataTabelCellDef<T>,
    ctx: any
  ): ctx is DtCellContext<T> {
    return true;
  }
}

/*
  Marca um `ng-template` como o corpo do cabeçalho de uma coluna.
  Opcional: se omitido, o `label`/`name` da coluna é usado como header,
  incluindo o botão de ordenação automático quando `sortable` está ativo.
*/
@Directive({
  selector: '[dtHeaderCellDef]',
  standalone: true
})
export class DataTableHeaderCellDef {
  constructor(public readonly template: TemplateRef<DtHeaderCellContext>){}

  static ngTemplateContextGuard(
    dir: DataTableHeaderCellDef,
    ctx: any
  ): ctx is DtHeaderCellContext {
    return true
  }
}

/*
  Define uma coluna dinâmica da tabela.
   Uso:
  `
    <ng-container dtColumnDef="email" label="E-mail" sortable filterable>
      <ng-template dtCellDef let-payment>
        <div class="lowercase">{{ payment.email }}</div>
      </ng-template>
    </ng-container>
  `
*/

// Coluna de ações da linha
@Directive({
  selector: '[dtRowActions]',
  standalone: true
})
export class DataTableRowActionsDef<TModel = any>{
  constructor(public readonly template: TemplateRef<DtCellContext<TModel>>){}
  
  static ngTemplateContextGuard<T>(
    dir: DataTableRowActionsDef<T>,
    ctx: any
  ): ctx is DtCellContext<T> {
    return true;
  }
}

@Directive({
  selector: '[dtColumnDef]',
  standalone: true
})
export class DataTableColumnDef<TModel = any> {
  // Identificador da coluna. Deve ser igual a uma chave do objeto de dados (accessorKey);
  @Input('dtColumnDef') name!: string;
  // Texto exibido no cabeçalho quan do nenhum dtHeaderCellDef é fornecido;
  @Input() label?: string;
  // Habilita ordenação no cabeçalho;
  @Input({ transform: booleanAttribute }) sortable = false;
  // Permite que a coluna seja ocultada;
  @Input({ transform: booleanAttribute }) hideable = true;
  // Marca a coluna como alvo padrão de filtro quando filterKey não é usado no template pai;
  @Input({ transform: booleanAttribute }) fiterable = false;
  // Alinhamento do conteúdo da célula;
  @Input() align: 'left' | 'center' | 'right' = 'left';

  @Input() size?: number;
  @Input() minSize?: number;
  @Input() maxSize?: number;
  @Input({ transform: booleanAttribute }) resizable = true;

  @ContentChild(DataTabelCellDef, { static: true }) cellDef?: DataTabelCellDef<TModel>;
  @ContentChild(DataTableHeaderCellDef, { static: true }) headerCellDef?: DataTableHeaderCellDef;
}