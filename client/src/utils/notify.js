import { toast } from 'react-toastify';

const notify = (message, type) => {
  switch (type) {
    case 'success':
      return toast.success(message, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
    case 'error':
      return toast.error(message, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
  }
};

export default notify;
