import React, { useState } from 'react'
import { ToastContainer } from 'react-toastify';

const PasswordReset = () => {

    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const setVal = (e) => {
        setEmail(e.target.value)
    }

    const sendLink = async (e) => {
        
        e.preventDefault()

        const res = await fetch("/sendpasswordlink",{
            method:"POST",
            headers:{
                "Content-Type": "application/json"
            },
            body:JSON.stringify({email})
        })
    
        const data = await res.json()
        // console.log(data);

        if(data.status === 201){
            setEmail("");
            setMessage(true)
        }else{
            console.log("Invalid User")
        }
    }

  return (
    <>
      <section>
        <div className="form_data">
          <div className="form_heading">
            <h1>Enter Your Email</h1>
          </div>

          {message ? <p style={{ color: "green", fontWeight: "bold" }}>pasword reset link send Succsfully in Your Email</p> : ""}
          
          <form>
            <div className="form_input">
              <label htmlFor="email">Email</label>
              <input type="email" name="email" id="email" onChange={setVal} value={email} placeholder="Enter your Email Address" />
            </div>
            <button className="btn" onClick={sendLink}>Send</button>
          </form>
          <ToastContainer />
        </div>
      </section>
    </>
  )
}

export default PasswordReset
