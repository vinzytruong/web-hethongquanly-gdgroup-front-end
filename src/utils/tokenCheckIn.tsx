import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const isValidTokenCheckIn = (accessToken: any) => {
    if (!accessToken) {
        return false;
    }
    const decoded = jwtDecode(accessToken);

    const currentTime = Date.now() / 1000;

    return decoded.exp! > currentTime;
};

const handleTokenExpired = (exp: any) => {
    let expiredTimer;

    const currentTime = Date.now();

    // Test token expires after 10s
    // const timeLeft = currentTime + 10000 - currentTime; // ~10s
    const timeLeft = exp * 1000 - currentTime;

    clearTimeout(expiredTimer);

    expiredTimer = setTimeout(() => {
        // eslint-disable-next-line no-alert
        alert('Token expired');

        localStorage.removeItem('accessTokenCheckIn');

        // window.location.href = '/auth';
    }, timeLeft);
};

const setSessionCheckIn = (accessToken: any) => {
    if (accessToken) {
        localStorage.setItem('accessTokenCheckIn', accessToken);
        axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        axios.defaults.headers.post['Content-Type'] = "*/*";
        axios.defaults.headers.post['Accept'] = "*/*";
        axios.defaults.headers.post['Access-Control-Allow-Origin'] = "*";
        axios.defaults.headers.post['Strict-Origin-When-Cross-Origin'] = "*";
        // This function below will handle when token is expired
        const { exp } = jwtDecode(accessToken); // ~5 days by minimals server
        handleTokenExpired(exp);
    } else {
        localStorage.removeItem('accessTokenCheckIn');
        delete axios.defaults.headers.common.Authorization;
    }
};
export { isValidTokenCheckIn, setSessionCheckIn };