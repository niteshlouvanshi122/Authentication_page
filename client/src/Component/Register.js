import React, { useState } from "react";
import "./mix.css";
import { NavLink } from "react-router-dom";
import {useNavigate} from "react-router-dom"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"


const Register = () => {

  const [passShow, setPassShow] = useState(false);
  const [CpassShow, setCpassShow] = useState(false);

  const navigate = useNavigate(); 

  const [inpVal, setInpVal] = useState({
    fname: "",
    email: "",
    password: "",
    cpassword: "",
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
    setInpVal({
      ...inpVal,
      [name]:value
    })
  };

  const addUserData = async (e) => {
    e.preventDefault()

    const {fname,email,password,cpassword} = inpVal;

    if(fname === ""){
      toast.error("Please enter Your name" ,toastOptions)
    }
    else if (email === ""){
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
    else if (cpassword === ""){
      toast.error("Enter Your Confirm password" ,toastOptions)
    }
    else if (cpassword.length < 6){
      toast.error("Confirm password must be 6 char" ,toastOptions)
    }
    else if (password !== cpassword){
      toast.error("Password and Confirm Password not match" ,toastOptions)
    }
    else {
      // alert("Sing Up Successfully...")
      const data = await fetch("/register",{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fname,email,password,cpassword
        })
      })
      const res = await data.json()
      // console.log(res.status);
      if(res.status===201){
        toast("Sing Up Successfully...." ,toastOptions)
        setInpVal({...inpVal,fname:"",email:"",password:"",cpassword:""})
        navigate("/")
      }
    }
  }

  return (
    <>
      <section>
        <div className="form_data">
          <div className="form_heading">
            <h1>Sign Up</h1>
            <p style={{ textAlign: "center" }}>
              We are glad that you will be using Project Cloud to manage <br />
              your tasks! We hope that you will get like it.
            </p>
          </div>
          <form>
            <div className="form_input">
              <label htmlFor="fname">Name</label>
              <input type="text" onChange={setVal} value={inpVal.fname} name="fname" id="fname" placeholder="Enter Your Name"/>
            </div>
            <div className="form_input">
              <label htmlFor="email">Email</label>
              <input type="email" onChange={setVal} value={inpVal.email} name="email" id="email" placeholder="Enter your Email Address"/>
            </div>
            <div className="form_input">
              <label htmlFor="password">Password</label>
              <div className="two">
                <input onChange={setVal} value={inpVal.password} type={!passShow ? "password" : "text"} name="password" id="password" placeholder="Enter your Password"/>
                <div className="showpass" onClick={() => setPassShow(!passShow)}>
                  {!passShow ? "Show" : "Hide"}
                </div>
              </div>
            </div>
            <div className="form_input">
              <label htmlFor="password">Confirm Password</label>
              <div className="two">
                <input onChange={setVal} value={inpVal.cpassword} type={!CpassShow ? "password" : "text"} name="cpassword" id="cpassword" placeholder="Confirm password"/>
                <div className="showpass" onClick={() => setCpassShow(!CpassShow)}>
                  {!CpassShow ? "Show" : "Hide"}
                </div>
              </div>
            </div>
            <button className="btn" onClick={addUserData}>Sign Up</button>
            <p>
              Already have an account? <NavLink to="/">Log In</NavLink>
            </p>
          </form>
        </div>
      </section>
      <ToastContainer/>
    </>
  );
};

export default Register;
