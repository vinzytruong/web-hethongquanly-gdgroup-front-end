import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const isValidToken = (accessToken:any) => {
  if (!accessToken) {
    return false;
  }
  const decoded = jwtDecode(accessToken);
  const currentTime = Date.now() / 1000;
  return decoded.exp! > currentTime;
};

const handleTokenExpired = (exp:any) => {
  let expiredTimer;
  const currentTime = Date.now();
  // Test token expires after 10s
  // const timeLeft = currentTime + 10000 - currentTime; // ~10s
  const timeLeft = exp * 1000 - currentTime;
  clearTimeout(expiredTimer);
  expiredTimer = setTimeout(() => {
    // eslint-disable-next-line no-alert
    alert('Token expired');
    localStorage.removeItem('accessToken');
    window.location.href = '/auth';
  }, timeLeft);
};

const setSession = (accessToken:any, accountObject:any) => {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('account', accountObject);
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    axios.defaults.headers.post['Content-Type'] = "*/*";
    axios.defaults.headers.post['Accept'] = "*/*";
    axios.defaults.headers.post['Access-Control-Allow-Origin'] = "*";
    axios.defaults.headers.post['Strict-Origin-When-Cross-Origin'] = "*";
    // This function below will handle when token is expired
    const { exp } = jwtDecode(accessToken); // ~5 days by minimals server
    handleTokenExpired(exp);
  } else {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('account');
    delete axios.defaults.headers.common.Authorization;
  }
};

export { isValidToken, setSession };
