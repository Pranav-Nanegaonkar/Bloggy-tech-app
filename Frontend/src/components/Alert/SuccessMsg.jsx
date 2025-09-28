import React from "react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { resetSuccessAction } from "../../redux/slices/globalSlice/globalSlices";
const SuccessMsg = ({ message }) => {
  const dispatch = useDispatch();
  Swal.fire({ icon: "success", title: "Good Job", text: message });
  dispatch(resetSuccessAction());
};

export default SuccessMsg;
