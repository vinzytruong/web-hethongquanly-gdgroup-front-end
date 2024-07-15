import { ReactNode } from "react";

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
    selected: number[]
}
export type Order = 'asc' | 'desc';

export interface EnhancedTableProps {
    numSelected: number;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleOrder: (e: any) => void;
    handleOrderBy: (e: any) => void;
    order: Order;
    orderBy: string | number | symbol;
    rowCount: number;
    headCells: any;
}

export interface PropsTable {
    title: string;
    handleOpenCard: (e: any) => void,
    handleViewId: (e: any) => void,
    handleSelected: (e: any) => void,
    handleDelete: (e: any) => void,
    selected: number[],
    rows: any[],
    rowsDetail?: any[],
    rowsDetailComponent?:ReactNode,
    head: any[];
    href?: string;
    orderByKey: string | number | symbol
}