import { DataTable } from "./data-table.component";
import { DataTabelCellDef } from "../../directives/data-table.directive";
import { DataTableHeaderCellDef } from "../../directives/data-table.directive";
import { DataTableColumnDef } from "../../directives/data-table.directive";
import { DataTableRowActionsDef } from "../../directives/data-table.directive";

export const DataTableImports = [
  DataTable,
  DataTabelCellDef,
  DataTableHeaderCellDef,
  DataTableColumnDef,
  DataTableRowActionsDef
] as const;