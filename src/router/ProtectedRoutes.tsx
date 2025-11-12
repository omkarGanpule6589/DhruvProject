import { Outlet, Navigate } from "react-router-dom";
import AuthUser from "../components/AuthUser";
// import React, { useState } from "react";

const ProtectedRoutes = () => {
   const {getToken} = AuthUser();
    // const isLoggedin = true
    // const [isLoggedin, setIsLoggedin]= useState<boolean>(true)

    return (
        getToken() ? <Outlet /> : <Navigate to="/" />
    ) 
}

export default ProtectedRoutes