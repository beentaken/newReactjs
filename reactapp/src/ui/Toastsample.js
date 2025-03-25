import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Toastsample = () => {
    // Trigger a success toast
    const notifySuccess = () => {
        toast.success("This is a success message!", {
            position: "top-center",    // Use string instead of toast.POSITION.TOP_RIGHT
            autoClose: 3000, // in milliseconds
        });
    };

    // Trigger an error toast
    const notifyError = () => {
        toast.error("This is an error message!", {
            position: "top-center",    // Use string instead of toast.POSITION.TOP_RIGHT
            autoClose: 3000,
        });
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>React Toastify Example</h1>
            <button onClick={notifySuccess}>Show Success Toast</button>
            <button onClick={notifyError}>Show Error Toast</button>

            <ToastContainer />

        </div>
    );
};

export default Toastsample;
