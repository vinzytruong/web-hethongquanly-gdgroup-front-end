// third-party
import { combineReducers } from 'redux';

// project imports
import productReducer from './product/reducer';
import sitesReducer from './sites/reducer';
import menuReducer from './menu/reducer';
import userReducer from './user/reducer';
import storageReducer from './storage/reducer';

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
    product: productReducer,
    sites: sitesReducer,
    menu: menuReducer,
    user: userReducer,
    storage:storageReducer,
});
export default reducer;
