import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { GET_LIST_DEPARTMENT_HANNET } from '@/store/department/action';

export default function useDepartment() {
    const dataDepartment = useAppSelector((state) => state.department)
    const [isLoadding, setIsLoading] = useState(true);
    const dispatch = useAppDispatch();

    const getAllDepartment = async () => {
        
    }

    return {
        isLoadding, dataDepartment, getAllDepartment
    };
}
