// third-party
import { combineReducers } from "redux";

// project imports
import menuReducer from "./menu/reducer";
import authReducer from "./auth/reducer";
import staffReducer from "./staff/reducer";
import checkingReducer from "./checking/reducer";
import departmentReducer from "./department/reducer";
import organizationReducer from "./organization/reducer";
import provinceReducer from "./province/reducer";
import districtReducer from "./district/reducer";
import communeReducer from "./commune/reducer";
import officersReducer from "./officers/reducer";
import contractorsReducer from "./contractors/reducer";
import contractorsTypeReducer from "./contractorsType/reducer";
import agencyReducer from "./agency/reducer";
import agencyTypeReducer from "./agencyType/reducer";
import supplierReducer from "./supplier/reducer";
import supplierTypeReducer from "./supplierType/reducer";
import authorReducer from "./author/reducer";
import interactionReducer from "./interaction/reducer";
import roleReducer from "./role/reducer";
import roleProvinceReducer from "./roleProvince/reducer";
import productReducer from "./products/reducer";
import productTypeReducer from "./productTypes/reducer";
import subjectReducer from "./subjects/reducer";
import gradeReducer from "./grades/reducer";
import circularsReducer from "./circulars/reducer";
import unitsReducer from "./units/reducer";
import companysReducer from "./companys/reducer";
import derparmentOfCompanyReduce from "./derparmentOfCompany/reducer";
import positionReducer from "./position/reducer";
import staffDetailReducer from "./staffDetail/reducer";
import workReducer from "./work/reducer";
import planMonthReducer from "./planMonth/reducer";
import planWeekReducer from "./planWeek/reducer";
import planDayReducer from "./planDay/reducer";
import productInEstimateReducer from "./productInEstimate/reducer";
import productInSharedEquipmentReducer from "./productInSharedEquipment/reducer";
import companyEstimatesReducer from "./companyEstimate/reducer";
import contractorInteractionsReducer from "./contractorInteraction/reducer";
import projectEstimateReducer from "./projectEstimate/reducer";
import reportProjectInteractReducer from "./reportProjectInteract/reducer";

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
  menu: menuReducer,
  auth: authReducer,
  staff: staffReducer,
  staffDetail: staffDetailReducer,
  checking: checkingReducer,
  department: departmentReducer,
  organization: organizationReducer,
  province: provinceReducer,
  district: districtReducer,
  commune: communeReducer,
  officers: officersReducer,
  contractors: contractorsReducer,
  contractorsType: contractorsTypeReducer,
  supplier: supplierReducer,
  supplierType: supplierTypeReducer,
  agency: agencyReducer,
  agencyType: agencyTypeReducer,
  author: authorReducer,
  interaction: interactionReducer,
  role: roleReducer,
  roleProvince: roleProvinceReducer,
  products: productReducer,
  productTypes: productTypeReducer,
  subjects: subjectReducer,
  grades: gradeReducer,
  circulars: circularsReducer,
  units: unitsReducer,
  companys: companysReducer,
  derparmentOfCompany: derparmentOfCompanyReduce,
  position: positionReducer,
  work: workReducer,
  plan: planMonthReducer,
  planWeek: planWeekReducer,
  planDay: planDayReducer,
  productInEstimates: productInEstimateReducer,
  productInSharedEquipments: productInSharedEquipmentReducer,
  companyEstimates: companyEstimatesReducer,
  contractorInteractions: contractorInteractionsReducer,
  projectEstimates:projectEstimateReducer,
  reportProjectInteract:reportProjectInteractReducer
});
export default reducer;
