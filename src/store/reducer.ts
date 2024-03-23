// third-party
import { combineReducers } from 'redux';

// project imports
import productReducer from './product/reducer';
import sitesReducer from './sites/reducer';
import menuReducer from './menu/reducer';
import authReducer from './auth/reducer';
import storageReducer from './storage/reducer';

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
    product: productReducer,
    sites: sitesReducer,
    menu: menuReducer,
    auth: authReducer,
    storage:storageReducer,
});
export default reducer;
