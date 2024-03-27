// third-party
import { combineReducers } from 'redux';

// project imports
import menuReducer from './menu/reducer';
import authReducer from './auth/reducer';
import staffReducer from './staff/reducer';
import checkingReducer from './staff/reducer';

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
    menu: menuReducer,
    auth: authReducer,
    staff:staffReducer,
    checking:checkingReducer
});
export default reducer;
