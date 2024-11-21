import { Api_Outer_Page } from './Api_Outer_Page';
import { Api_Inventory } from './Api_Inventory';
import { Api_Production } from './Api_Production';
import { Api_Order } from './Api_Order';
import { Api_Report } from './Api_Report';
import { Api_Users } from './Api_Users';
import { Api_Support } from './Api_Support';
import { Api_Setting } from './Api_Setting';
import { Api_Dashboard } from './Api_Dashboard';


const Admin_Api = async (dispatch) => {
  try {
    await Api_Dashboard(dispatch);
    await Api_Outer_Page(dispatch);
    await Api_Inventory(dispatch);
    await Api_Production(dispatch);
    await Api_Order(dispatch);
    await Api_Report(dispatch);
    await Api_Users(dispatch);
    await Api_Support(dispatch);
    await Api_Setting(dispatch);
  } catch (error) {
    console.log(error);
    window.alert(error.message);
  }
};

export default Admin_Api