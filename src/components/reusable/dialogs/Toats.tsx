import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

class Toast {
    public static error = (message: string) => {
        toast.error(message, {
            position: 'top-right',
            autoClose: 2000
        })
    }

    public static success = (message: string) => {
        toast.success(message, {
            position: 'top-right',
            autoClose: 2000
        })
    }
}

export default Toast;