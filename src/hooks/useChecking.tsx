import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import axios from 'axios';
import { GET_DATA_CHECKING } from '@/store/checking/action';
import qs from 'qs';

export default function useChecking() {
    const dataChecking = useAppSelector((state) => state.checking)
    const [isLoadding, setIsLoading] = useState(true);
    const dispatch = useAppDispatch();

    const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxODkxNTQ1NjE3MDIwODg4MzQiLCJlbWFpbCI6ImluZm9AZ2R2aWV0bmFtLmNvbSIsImNsaWVudF9pZCI6IjdhYTllMDYzMDg0NmI4OWJhNzI3MGFjZWY5NWZkMmVhIiwidHlwZSI6ImF1dGhvcml6YXRpb25fY29kZSIsImlhdCI6MTcwNTAzMzcyMSwiZXhwIjoxNzM2NTY5NzIxfQ.5W9qdWS4lVuCx1XbJXHK5UDQKP5P7yGWM-WdAmOyI_I';
    const year = new Date().getFullYear()
    const month = new Date().getMonth() + 1
    const day = new Date().getDate()

    function date() {
        if (month < 9)
            return year + '-0' + month + '-' + day
        else
            return year + '-' + month + '-' + day
    }
    const data = qs.stringify({
        'token': accessToken,
        'placeID': '20021',
        'date': date(),
        'exType': '2,1',
        'devices': 'C21283M571',
        'type': '0',
        'page': 1,
        'size': 500
    });
    const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://partner.hanet.ai/person/getCheckinByPlaceIdInDay',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded', // Thêm header Content-Type
        },
        data: data
    };


    const getAllChecking = async () => {

        try {
            const response = await axios(config)

            dispatch(GET_DATA_CHECKING(response.data.data));

            setIsLoading(false)
            return true;
        } catch (error) {

            setIsLoading(false)
            return false;
        }
    }


    return {
        isLoadding, dataChecking, getAllChecking
    };
}
