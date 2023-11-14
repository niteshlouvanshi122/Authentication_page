import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { LoginContext } from './ContextProvider/context';
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";


const Deshbord = () => {

  const { loginData, setLoginData } = useContext(LoginContext);
  const [data, setData] = useState(false);

  // console.log(loginData.ValidUserOne)

  const navigate = useNavigate();

    const DeshbordValid = async () => {
        let token = localStorage.getItem("usersDataToken");
        // console.log(token);

        const res = await fetch("/validuser",{
            method:"GET",
            headers:{
                "Content-Type": "application/json",
                "Authorization": token
            }
        })
        const data = await res.json()
        
        if(data.status === 401 || !data){
            navigate("*")
        }else{
            console.log("user verify....");
            setLoginData(data)
            navigate("/dash")
        }
    }
    
    useEffect(() => {
      setTimeout(() => {
        setData(true)
        DeshbordValid()
      }, 2000);
      // eslint-disable-next-line
    },[]);

  return (
    <>
      {
        data ? <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <img src="./man.png" alt="logo" style={{ width: "200px", marginTop: 80 }} />
        <h1 style={{ marginTop: 15 }}>User Name : {loginData ? loginData.ValidUserOne.fname.charAt(0).toUpperCase() + loginData.ValidUserOne.fname.slice(1) : " ...."} </h1>
        <h1 style={{ marginTop: -18 }}>User Email : {loginData ? loginData.ValidUserOne.email : " ...."} </h1>
      </div> :  <Box sx={{ display: 'flex', justifyContent: "center", alignItems: "center", height: "100vh" }}>
          &nbsp;
          <CircularProgress />
        </Box>
      }
    </>
  )
}

export default Deshbord
