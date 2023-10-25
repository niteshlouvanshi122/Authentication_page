import React, { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify';
import {useNavigate, useParams} from "react-router-dom"

const ForgotPassword = () => {

  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")

  const {id,token} = useParams()

  const navigat = useNavigate()

  const userValid = async () => {
    const res = await fetch(`/forgotpassword/${id}/${token}`,{
      method:"GET",
      headers:{
        "Content-Type":"application/json"
      }
    })

    const data = await res.json()

    if(data.status === 201){
      console.log("user valid");
    }else{
      navigat("*")
    }

  }

  const setVal = (e) => {
    setPassword(e.target.value)
  }

  const sendPassword = async (e) => {
    e.preventDefault()

    const res = await fetch(`/${id}/${token}`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({password})
    })

    const data = await res.json()

    if(data.status === 201){
      setPassword("")
      setMessage(true)
    }else{
      console.log("token Expired Generate New link");
    }
    
  }

  useEffect(()=>{
    userValid()
    // eslint-disable-next-line
  },[])

  return (
    <>
      <section>
        <div className="form_data">
          <div className="form_heading">
            <h1>Enter Your New Password</h1>
          </div>
          {message ? <p style={{ color: "green", fontWeight: "bold" }}>Password Succesfully updated..</p> : ""} 
          <form>
            <div className="form_input">
              <label htmlFor="email">New Password</label>
              <input type="password" name="password" id="password" onChange={setVal} value={password} placeholder="Enter your new password" />
            </div>
            <button className="btn" onClick={sendPassword}>Send</button>
          </form>
          <ToastContainer />
        </div>
      </section>
    </>
  )
}

export default ForgotPassword
