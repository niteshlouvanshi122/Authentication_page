import React, { useState } from "react";
import "./mix.css";
import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"

const Login = () => {

  const navigate = useNavigate();

  const [passShow, setPassShow] = useState(false)

  const [inpVal, setInpVal] = useState({
    email: "",
    password: ""
  });
  // console.log(inpVal);

  const toastOptions = {
    position: "bottom-right",
    autoClose: 3000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const setVal = (e) => {
    const {name,value} = e.target
    setInpVal(()=>{
      return {
        ...inpVal,
        [name]:value
      }
    })
  };

  const loginUser = async (e) => {
    e.preventDefault()

    const {email,password} = inpVal;

    if (email === ""){
      toast.error("Please enter Your email" ,toastOptions)
    }
    else if (!email.includes("@")){
      toast.error("Enter valid email" ,toastOptions)
    }
    else if (password === ""){
      toast.error("Enter Your password" ,toastOptions)
    }
    else if (password.length < 6){
      toast.error("Password must be 6 char" ,toastOptions)
    }
    else {
      const data = await fetch("/login",{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,password
        })
      })
      const res = await data.json()
      // console.log(res);
      if(res.status===201){
        localStorage.setItem("usersDataToken",res.result.token)
        toast("Login Successfully....", toastOptions);
        // alert("Login Successfully....")
        navigate("/dash")
        setInpVal({...inpVal,email:"",password:""})
      }else{
        toast.error("Invalid Details",toastOptions);
    }
    }
  }

 

  return (
    <>
      <section>
        <div className="form_data">
          <div className="form_heading">
            <h1>Welcome Back, Log In</h1>
            <p>Hi, we are you glad you are back. Please login.</p>
          </div>
          <form>
            <div className="form_input">
              <label htmlFor="email">Email</label>
              <input type="email" name="email" id="email" onChange={setVal} value={inpVal.email} placeholder="Enter your Email Address" />
            </div>
            <div className="form_input">
              <label htmlFor="password">Password</label>
              <div className="two">
                <input type={!passShow ? "password" : "text" } onChange={setVal} value={inpVal.password} name="password" id="password" placeholder="Enter your Password" />
                <div className="showpass" onClick={()=>setPassShow(!passShow)} >
                  {
                    !passShow ? "Show" : "Hide"
                  }
                </div>
              </div>
            </div>
            <button className="btn" onClick={loginUser}>Login</button>
            <p>Don't have an Account? <NavLink to="/register">Sing Up</NavLink></p>
            <p style={{color:"black",fontWeight:"bold"}}>Forgot Password <NavLink to="/password-reset">Click Here</NavLink></p>
          </form>
        </div>
      </section>
      <ToastContainer/>
    </>
  );
};

export default Login;
