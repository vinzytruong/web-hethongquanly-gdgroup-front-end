import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import axios from 'axios';
import qs from 'qs';
import { GET_LIST_DEPARTMENT_HANNET } from '@/store/department/action';
import { GET_DATA_CHECKING } from '@/store/checking/action';

export default function useDepartment() {
    const dataDepartment = useAppSelector((state) => state.department)
    const dataCheckin = useAppSelector((state) => state.checking)
    const [isLoadding, setIsLoading] = useState(true);
    const dispatch = useAppDispatch();

    const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxODkxNTQ1NjE3MDIwODg4MzQiLCJlbWFpbCI6ImluZm9AZ2R2aWV0bmFtLmNvbSIsImNsaWVudF9pZCI6IjdhYTllMDYzMDg0NmI4OWJhNzI3MGFjZWY5NWZkMmVhIiwidHlwZSI6ImF1dGhvcml6YXRpb25fY29kZSIsImlhdCI6MTcwNTAzMzcyMSwiZXhwIjoxNzM2NTY5NzIxfQ.5W9qdWS4lVuCx1XbJXHK5UDQKP5P7yGWM-WdAmOyI_I';


    const getAllDepartment = async () => {
        const data = qs.stringify({
            'token': accessToken,
            'placeID': '20021',
            'page': 1,
            'size': 500
        });

        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://partner.hanet.ai/department/list',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded', // Thêm header Content-Type
            },
            data: data
        };
        try {
            const response = await axios(config)
            console.log(response);

            dispatch(GET_LIST_DEPARTMENT_HANNET({ department: { dataDepartment: response.data.data.hits, error: null } }));
            setIsLoading(false)
            return true;
        } catch (error) {
            setIsLoading(false)
            return false;
        }
    }

    const getPersonInDepartment = async (id: number, name: string) => {

        const data = qs.stringify({
            'token': accessToken,
            // 'departmentID':id.toString(),
            'keyword': name,
            'page': 1,
            'size': 500
        });
        console.log('fetch', id, name);

        var urlencoded = new URLSearchParams();
        urlencoded.append("token", accessToken);
        urlencoded.append("departmentID", id.toString());
        urlencoded.append("keyword", name);
        urlencoded.append("page", '1');
        urlencoded.append("size", '500');

        fetch("https://partner.hanet.ai/department/list-person", {
            method: 'POST',
            body: urlencoded,
            redirect: 'follow'
        })
            .then(async response => {
                const personByDepartment = await response.json()
                console.log('fetch:', personByDepartment.data)
                const filterData=dataCheckin.dataChecking?.filter((item) => personByDepartment.data.find((itemDepartment: any) => itemDepartment.personID === item.personID))
                dispatch(GET_DATA_CHECKING({ checking: { dataChecking: filterData, error: null } }));
            })
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
    }

    return {
        isLoadding, dataDepartment, getAllDepartment, getPersonInDepartment
    };
}
