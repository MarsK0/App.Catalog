export interface IModuleNavItem {
  readonly code: string,
  readonly label: string,
  readonly icon: string,
  readonly children: readonly INavItem[]
}
export interface INavItem {
  label: string;
  code: string;
  url: string;
  icon: string;
}

// #region Modulos
const SYSTEM: IModuleNavItem = {
  code: "SYSTEM",
  label: "Sistema",
  icon: "lucideShieldUser",
  children: [
    { code: "TENANT", label: "Clientes", url: "system/tenant", icon: "lucideUser" }
  ]
};
const TABLES: IModuleNavItem = {
  code: "TABLES",
  label: "Tabelas",
  icon: "lucideTableProperties",
  children: []
};
const CATALOG: IModuleNavItem = {
  code: "CATALOG",
  label: "Catálogo",
  icon: "lucideLayoutList",
  children: [] 
};
const COMERCIAL: IModuleNavItem = {
  code: "COMERCIAL",
  label: "Comercial",
  icon: "lucideShoppingCart",
  children: []
};
// #endregion

export const TENANT_MODULES: readonly IModuleNavItem[] = [
  TABLES,
  CATALOG,
  COMERCIAL,
];
export const MODULES: readonly IModuleNavItem[] = [SYSTEM, ...TENANT_MODULES];