export interface DepartmentStateProps {
    dataDepartment?: GetDepartment[];
    error?: object | string | null;
}

export interface GetDepartment {
    createdAt: string,
    desc: string,
    enable: number,
    id: number,
    name: string,
    numEmployee: string,
    placeId: string,
    status:number,
    updatedAt: string
  }