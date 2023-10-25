import Header from "./Component/Header";
import Login from "./Component/Login";
import Register from "./Component/Register";
import Deshbord from "./Component/Deshbord";
import Error from "./Component/Error";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { LoginContext } from "./Component/ContextProvider/context";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import ForgotPassword from "./Component/forgotPassword";
import PasswordReset from "./Component/passwordReset";

function App() {
  // eslint-disable-next-line
  const { loginData, setLoginData } = useContext(LoginContext);
  const [data, setData] = useState(false);
  // console.log(loginData.ValidUserOne);

  const navigate = useNavigate();

  const DeshbordValid = async () => {
    let token = localStorage.getItem("usersDataToken");
    // console.log(token);

    const res = await fetch("/validuser", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    const data = await res.json();

    if (data.status === 401 || !data) {
      console.log("User not valid");
    } else {
      console.log("user verify....");
      setLoginData(data);
      navigate("/dash");
    }
  };

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
          data ? (
            <>
            <Header />
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dash" element={<Deshbord />} />
              <Route path="/password-reset" element={<PasswordReset />} />
              <Route path="/forgotpassword/:id/:token" element={< ForgotPassword/>} />
              <Route path="*" element={<Error />} />
            </Routes>
          </>
          )
          :
          <Box sx={{ display: 'flex', justifyContent: "center", alignItems: "center", height: "100vh" }}>
          &nbsp;
          <CircularProgress />
        </Box>
      }
    </>
  );
}

export default App;
