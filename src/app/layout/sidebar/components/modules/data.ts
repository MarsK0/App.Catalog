export class ModuleNavItem {
  constructor(
    public code: string,
    public title: string,
    public icon: string,
    public children: readonly NavItem[]
  ) {}
}
export interface NavItem {
  title: string;
  code: string;
  url: string;
  icon: string;
}

// #region Modulos
const PLATFORM: ModuleNavItem = new ModuleNavItem(
  "PLATFORM",
  "Platform",
  "lucideShieldUser",
  [
    { code: "TENANT", title: "Clientes", url: "#", icon: "lucideUser" }
  ]
);
const TABLES: ModuleNavItem = new ModuleNavItem(
  "TABLES",
  "Tabelas",
  "lucideTableProperties",
  []
);
const CATALOG: ModuleNavItem = new ModuleNavItem(
  "CATALOG",
  "Catálogo",
  "lucideLayoutList",
  [] 
);
const COMERCIAL: ModuleNavItem = new ModuleNavItem(
  "COMERCIAL",
  "Comercial",
  "lucideShoppingCart",
  []
);
// #endregion

export const MODULES: readonly ModuleNavItem[] = [
  PLATFORM,
  TABLES,
  CATALOG,
  COMERCIAL,
];