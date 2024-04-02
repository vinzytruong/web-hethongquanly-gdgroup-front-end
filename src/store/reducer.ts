// third-party
import { combineReducers } from 'redux';

// project imports
import menuReducer from './menu/reducer';
import authReducer from './auth/reducer';
import staffReducer from './staff/reducer';
import checkingReducer from './checking/reducer';
import departmentReducer from './department/reducer';
import organizationReducer from './organization/reducer';
import provinceReducer from './province/reducer';
import districtReducer from './district/reducer';
import officersReducer from './officers/reducer';
import contractorsReducer from './contractors/reducer';
import supplierReducer from './supplier/reducer';
import authorReducer from './author/reducer';

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
    menu: menuReducer,
    auth: authReducer,
    staff:staffReducer,
    checking:checkingReducer,
    department:departmentReducer,
    organization:organizationReducer,
    province:provinceReducer,
    district:districtReducer,
    officers:officersReducer,
    contractors:contractorsReducer,
    supplier:supplierReducer,
    author:authorReducer
});
export default reducer;
