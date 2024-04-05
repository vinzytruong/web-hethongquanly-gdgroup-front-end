import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import axios from 'axios';
import { GET_DATA_CHECKING } from '@/store/checking/action';
import qs from 'qs';
import moment from 'moment';
import { jwtDecode } from 'jwt-decode';

export default function useChecking() {
    const dataChecking = useAppSelector((state) => state.checking)
    const [isLoadding, setIsLoading] = useState(true);
    const dispatch = useAppDispatch();

    const handleTokenExpired = (exp: any, accessToken: any) => {
        let expiredTimer;
        const currentTime = Date.now();
        const timeLeft = exp * 1000 - currentTime;
        clearTimeout(expiredTimer);
        expiredTimer = setTimeout(() => {
            alert('Token expired');
            localStorage.removeItem('accessTokenCheckIn');
            getToken(accessToken)
        }, timeLeft);
    };
    useEffect(() => {
        const accessToken = localStorage.getItem('accessTokenCheckIn');
        if (accessToken) {
            const { exp } = jwtDecode(accessToken); // ~5 days by minimals server
            handleTokenExpired(exp, accessToken);
        }
        else {
            localStorage.setItem('accessTokenCheckIn', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxODkxNTQ1NjE3MDIwODg4MzQiLCJlbWFpbCI6ImluZm9AZ2R2aWV0bmFtLmNvbSIsImNsaWVudF9pZCI6IjdhYTllMDYzMDg0NmI4OWJhNzI3MGFjZWY5NWZkMmVhIiwidHlwZSI6InJlZnJlc2hfdG9rZW4iLCJpYXQiOjE3MTIxMjY0NTgsImV4cCI6MTc0MzY2MjQ1OH0.eB0kDJNiida_gUrjZOfzHSTPnVB_M-ImB_aH_1LfGSQ');
        }
    }, [])

    const getToken = async (accessToken: any) => {
        try {

            var urlencoded = new URLSearchParams();
            urlencoded.append("grant_type", "refresh_token");
            urlencoded.append("client_id", "7aa9e0630846b89ba7270acef95fd2ea");
            urlencoded.append("client_secret", "d6e83ba9d9ce9e57a83d3177d153e818");
            urlencoded.append("refresh_token", accessToken);

            const requestOptions = {
                method: 'POST',
                body: urlencoded,
            };

            fetch("https://oauth.hanet.com/token", requestOptions)
                .then(async response => {
                    const dataResponse = await response.json()
                    console.log("refresh_token", dataResponse.data);
                    localStorage.setItem('accessTokenCheckIn', dataResponse.data.access_token);
                })
                .then(result => console.log(result))
                .catch(error => console.log('error', error));
            return true;

        } catch (error) {
            return false;
        }
    }
    const getCheckInNow = async () => {
        const accessToken = localStorage.getItem('accessTokenCheckIn');
        const dateCheckin = moment().format('YYYY-MM-DD')
        try {
            if (accessToken) {
                var urlencoded = new URLSearchParams();
                urlencoded.append("token", accessToken);
                urlencoded.append("placeID", "20021");
                urlencoded.append("date", dateCheckin);
                urlencoded.append("exType", "2,1");
                urlencoded.append("devices", "C21283M571");
                // urlencoded.append("exDevices", "<deviceID1, deivceID2,>");
                urlencoded.append("type", "0");
                // urlencoded.append("aliasID", "<aliasID>");
                // urlencoded.append("personID", "<personID>");
                // urlencoded.append("personIDs", "<personID1,personID2,personID3,..>");
                // urlencoded.append("aliasIDs", "<aliasID1,aliasID2, aliasID3,....>");
                urlencoded.append("page", "1");
                urlencoded.append("size", "500");

                const requestOptions = {
                    method: 'POST',
                    body: urlencoded,
                    // redirect: 'follow'
                };

                fetch("https://partner.hanet.ai/person/getCheckinByPlaceIdInDay", requestOptions)
                    .then(async response => {
                        const dataResponse = await response.json()
                        console.log("chamcong", dataResponse.data);
                        dispatch(GET_DATA_CHECKING({ checking: { dataChecking: dataResponse.data, error: null } }));
                    })
                    .then(result => console.log(result))
                    .catch(error => console.log('error', error));
                setIsLoading(false)
                return true;
            }

        } catch (error) {

            setIsLoading(false)
            return false;
        }
    }

    const getCheckInFromDateToDate = async (personIDs: string, fromTimeStamp: any, toTimeStamp: any) => {
        const accessToken = localStorage.getItem('accessTokenCheckIn');


        try {
            if (accessToken) {
                var urlencoded = new URLSearchParams();
                urlencoded.append("token", accessToken);
                urlencoded.append("placeID", "20021");
                urlencoded.append("from", fromTimeStamp.toString());
                urlencoded.append("to", toTimeStamp.toString());
                urlencoded.append("exType", "2,1");
                urlencoded.append("devices", "C21283M571");
                // urlencoded.append("exDevices", "<deviceID1, deivceID2,>");
                urlencoded.append("type", "0");
                // urlencoded.append("aliasID", "<aliasID>");
                // urlencoded.append("personID", personID);

                urlencoded.append("personIDs", personIDs)
                // urlencoded.append("aliasIDs", "<aliasID1,aliasID2, aliasID3,....>");
                urlencoded.append("page", "1");
                urlencoded.append("size", "500");

                const requestOptions = {
                    method: 'POST',
                    body: urlencoded,
                    // redirect: 'follow'
                };

                fetch("https://partner.hanet.ai/person/getCheckinByPlaceIdInTimestamp", requestOptions)
                    .then(async response => {
                        const dataResponse = await response.json()
                        dispatch(GET_DATA_CHECKING({ checking: { dataChecking: dataResponse.data, error: null } }));
                    })
                    .then(result => console.log(result))
                    .catch(error => console.log('error', error));
                setIsLoading(false)
                return true;
            }

        } catch (error) {
            setIsLoading(false)
            return false;
        }


    }

    const getPersonInDepartment = async (id: number, name: string) => {
        // console.log('fetch', id, name);

        // var urlencoded = new URLSearchParams();
        // urlencoded.append("token", accessToken);
        // urlencoded.append("departmentID", id.toString());
        // urlencoded.append("keyword", name);
        // urlencoded.append("page", '1');
        // urlencoded.append("size", '500');

        // fetch("https://partner.hanet.ai/department/list-person", {
        //     method: 'POST',
        //     body: urlencoded,
        //     redirect: 'follow'
        // })
        //     .then(async response => {
        //         const personByDepartment = await response.json()
        //         console.log('fetch:', personByDepartment.data)
        //         const filterData = dataChecking.dataChecking?.filter((item) => personByDepartment.data.find((itemDepartment: any) => itemDepartment.personID === item.personID))

        //         dispatch(GET_DATA_CHECKING({ checking: { dataChecking: filterData, error: null } }));
        //     })
        //     .then(result => console.log(result))
        //     .catch(error => console.log('error', error));
    }

    return {
        isLoadding, dataChecking, getCheckInNow, getPersonInDepartment, getToken, getCheckInFromDateToDate
    };
}
