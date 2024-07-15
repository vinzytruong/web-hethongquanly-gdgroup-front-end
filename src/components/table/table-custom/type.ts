export interface HeadCell {
  disablePadding: boolean;
  id: keyof any;
  label: string;
  numeric: boolean;
}
export interface EnhancedTableToolbarProps {
  numSelected: number;
  title: string;
  handleSelected: (e: any) => void;
  handleDelete: (e: any) => void;
  selected: number[];
}
export type Order = "asc" | "desc";

export interface EnhancedTableProps {
    numSelected: number;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleOrder: (e: any) => void;
    handleOrderBy: (e: any) => void;
    order: Order;
    orderBy: string | number | symbol;
    rowCount: number;
    headCells: any;
    isRoleDelete?:boolean
}

export interface PropsTable {
    title: string;
    handleOpenCard?: (e: any) => void,
    handleOpenEditCard?: (e: any) => void,
    handleOpenViewCard?: (e: any) => void,
    handleViewId?: (e: any) => void,
    handleEditId?: (e: any) => void,
    handleSelected: (e: any) => void,
    handleDelete: (e: any) => void,
    selected: number[],
    contentSearch: string,
    rows: any[],
    head: any[];
    href?: string;
    orderByKey: string | number | symbol;
    roleName?: string[]
    isButtonEdit?:boolean,
    isButtonView?:boolean,
    isRoleDelete?:boolean,
    handleReportId?: (e: any) => void;
    handleOpenReportCard?: (e: any) => void;
    isButtonReport?: boolean;
}

