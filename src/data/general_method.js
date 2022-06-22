import Swal from "sweetalert2";

export function showAlertSuccess(message) {
  Swal.fire({
    text: message,
    icon: "success",
    toast: true,
    position: "top-end",
    timerProgressBar: true,
    timer: 3000,
    showConfirmButton: false
  });
}

export function showAlertError(message) {
  Swal.fire({
    text: message,
    icon: "error",
    toast: true,
    position: "top-end",
    timerProgressBar: true,
    timer: 3000,
    showConfirmButton: false
  });
}
