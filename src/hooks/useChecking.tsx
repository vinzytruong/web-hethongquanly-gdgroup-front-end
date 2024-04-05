import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { GET_DATA_CHECKING } from '@/store/checking/action';
import moment from 'moment';
import { jwtDecode } from 'jwt-decode';
import { clientID, clientSecret, defaultAccessTokenHannet } from '@/constant/hannet';
import { getCheckinByPlaceIdInDay, getCheckinByPlaceIdInTimestamp, getTokenHannet } from '@/constant/api';

export default function useChecking() {
    const dataChecking = useAppSelector((state) => state.checking)
    const [isLoadding, setIsLoading] = useState(true);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const accessToken = localStorage.getItem('accessTokenCheckIn');
        if (accessToken) handleTokenHannetExpired(jwtDecode(accessToken).exp, accessToken);
        else localStorage.setItem('accessTokenCheckIn', defaultAccessTokenHannet);
    }, [])

    const handleTokenHannetExpired = (exp: any, accessToken: any) => {
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

    const getToken = async (accessToken: any) => {
        try {
            var urlencoded = new URLSearchParams();
            urlencoded.append("grant_type", "refresh_token");
            urlencoded.append("client_id", clientID);
            urlencoded.append("client_secret", clientSecret);
            urlencoded.append("refresh_token", accessToken);

            const requestOptions = {
                method: 'POST',
                body: urlencoded,
            };

            fetch(getTokenHannet, requestOptions)
                .then(async response => {
                    const dataResponse = await response.json()
                    localStorage.setItem('accessTokenCheckIn', dataResponse.data.access_token);
                })
                .then(result => console.log(result))
                .catch(error => console.log('Error: ', error));
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

                fetch(getCheckinByPlaceIdInDay, requestOptions)
                    .then(async response => {
                        const dataResponse = await response.json()
                        console.log("chamcong", dataResponse.data);
                        dispatch(GET_DATA_CHECKING({ checking: { dataChecking: dataResponse.data, error: null } }));
                    })
                    .then(result => console.log(result))
                    .catch(error => console.log('Error: ', error));
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

                fetch(getCheckinByPlaceIdInTimestamp, requestOptions)
                    .then(async response => {
                        const dataResponse = await response.json()
                        dispatch(GET_DATA_CHECKING({ checking: { dataChecking: dataResponse.data, error: null } }));
                    })
                    .then(result => console.log(result))
                    .catch(error => console.log('Error: ', error));
                setIsLoading(false)
                return true;
            }
        } catch (error) {
            setIsLoading(false)
            return false;
        }
    }

    const getPersonInDepartment = async (id: number, name: string) => {
    }

    return {
        isLoadding, dataChecking, getCheckInNow, getPersonInDepartment, getToken, getCheckInFromDateToDate
    };
}
