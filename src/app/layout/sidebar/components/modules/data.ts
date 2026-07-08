export class ModuleNavItem {
  constructor(
    public code: string,
    public title: string,
    public icon: string,
    public children: readonly NavItem[],
    public isActive = false
  ) {}
    toggle() {
    this.isActive = !this.isActive;
  }
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
  "",
  []
);
const CATALOG: ModuleNavItem = new ModuleNavItem(
  "CATALOG",
  "Catálogo",
  "",
  [] 
);
const COMERCIAL: ModuleNavItem = new ModuleNavItem(
  "COMERCIAL",
  "Comercial",
  "",
  []
);
// #endregion

export const MODULES: readonly ModuleNavItem[] = [
  PLATFORM,
  TABLES,
  CATALOG,
  COMERCIAL
];