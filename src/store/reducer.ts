// third-party
import { combineReducers } from 'redux';

// project imports
import menuReducer from './menu/reducer';
import authReducer from './auth/reducer';
import staffReducer from './staff/reducer';

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
    menu: menuReducer,
    auth: authReducer,
    staff:staffReducer,
});
export default reducer;
