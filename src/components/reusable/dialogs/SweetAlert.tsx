import Swal from "sweetalert2";
import lottie from "lottie-web";
import successAnimation from "@assets/json/loading.json";

class Sweetalert {
    public static loading = (message: string) => {
      Swal.close();
      if (Swal.isVisible()) return;

        Swal.fire({
          html: `
            <div style="overflow: hidden">
              <div id="lottie-animation" style="display: flex; justify-content: center; margin: auto; width: 240px; transform: scale(1.6)"></div>
            </div>
            <h3>${message}</h3>
          `,
          allowOutsideClick: false,
          allowEscapeKey: false,
          showCancelButton: false,
          showConfirmButton: false,
          focusConfirm: false,
          width: "300px",
          didOpen: () => {
            const container = document.getElementById("lottie-animation");
            if (container) {
              lottie.loadAnimation({
                container: container,
                renderer: "svg",
                loop: true,
                autoplay: true,
                animationData: successAnimation,
              });
            }
          },
        });
    }

    public static error = ({
      title = "Oops...",
      message,
      err
    }: {
      title?: string, 
      message?: string, 
      err?: string | unknown
    }) => {
      Swal.fire({
        icon: "error",
        title: title,
        text: message,
        footer: err ? `<i>${err}</i>` : undefined
      });
    }

    public static success = ({
      title = "Berhasil",
      message
    }: {
      title?: string, 
      message?: string
    }) => {
      Swal.fire({
        icon: "success",
        title: title,
        text: message,
      });
    }

    public static confirm = ({
      title,
      message,
      onConfirm,
      html,
      preConfirm,
      showConfirmButton = true
    }: {
      title?: string, 
      message?: string, 
      onConfirm?: (value?: any) => void,
      html?: string | HTMLElement | JQuery | undefined,
      preConfirm?(inputValue: any): any,
      showConfirmButton?: boolean | undefined
    }) => {
      Swal.fire({
        title: title,
        confirmButtonColor: '#38b964',
        showDenyButton: true,
        showConfirmButton,
        confirmButtonText: "Ya",
        denyButtonText: `Tidak`,
        text: message,
        icon: 'question',

        html: html,
        focusConfirm: false,
        preConfirm: preConfirm
      }).then((result) => {
        if (result.isConfirmed) {
          if (onConfirm) onConfirm(result.value)
        }
      });
    }

    public static close = () => {
      Swal.close();
  } 
}

export default Sweetalert;