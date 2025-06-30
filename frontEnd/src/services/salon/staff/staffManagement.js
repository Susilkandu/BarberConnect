import API from "../../api";

const staffManagementServices = {
    // Add new Staff 
    addStaff: async(name, gender, dob, phone, email, role, status)=>{
        const res = await API.post('salon/staff/addStaff',{name, gender, dob, phone, email, role, status});
        return res;
    },
    // update Staff data
    updateStaff: async(staff_id, filter)=>{
        const res = await API.put('salon/staff/updateStaff',{staff_id, filter});
        return res;
    },
    // get Staff List
    getStaffList: async()=>{
        const res = await API.get('salon/staff/getStaffList');
        return res;
    },
    // delete one staff
    deleteStaff: async(staff_id)=>{
        const res = await API.delete(`salon/staff/deleteStaff/${staff_id}`);
        return res;
    }
};
export default staffManagementServices;