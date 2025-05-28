import { toast } from 'react-hot-toast'
import { setLoading } from "../components/public/authSlice";

const requiestHandler = async (dispatch, fn, { onSuccess, onError } = {}) => {
  try {
  dispatch(setLoading({ loading: true }));
  const res = await fn();
    if (res?.data?.success) {
      toast.success(res?.data?.message || "Success");
      if (onSuccess) onSuccess(res);
    } else {
      toast.error(res?.data?.message || "Something went wrong.");
      if (onError) onError(res);
    }
    return res;
  } catch (error) {
    const serverMessage = error?.response?.data?.message || "Unexpected error occured";
    if (error?.response?.status === 401) {
      toast.error(serverMessage);
    } else if (Array.isArray(serverMessage)) {
      toast.error(serverMessage.join(', '));
    }else if (typeof serverMessage === "string"){
      toast.error(serverMessage);
    }else if (error?.request) {
      toast.error("Network error. Please check your internet connection.");
    } else {
      toast.error("Unexpected error. Please try again.");
    }
    console.error(error);
  } finally {
    dispatch(setLoading({ loading: false }));
  }
};

export default requiestHandler;
