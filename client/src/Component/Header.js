import React, { useContext } from 'react'
import "./header.css"
import Avatar from "@mui/material/Avatar"
import { LoginContext } from './ContextProvider/context';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { NavLink, useNavigate } from 'react-router-dom';


const Header = () => {

  const navigate = useNavigate();

  const { loginData, setLoginData } = useContext(LoginContext);
  // console.log(setLoginData);
  
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
      setAnchorEl(null);
  };

  const logoutuser = async () =>{
      let token = localStorage.getItem("usersDataToken");
      // console.log(token);

      const res = await fetch("/logout",{
          method:"GET",
          headers:{
              "Content-Type": "application/json",
              "Authorization": token,
              Accept:"application/json"
          },
          credentials:"include"
      })
      const data = await res.json()
      
      if(data.status === 201){
        console.log("Log-Out successfuly....");
          localStorage.removeItem("usersDataToken")
          setLoginData(false)
          navigate("/")
      }else{
        console.log("error");
      }
  }

  const goDash = () =>{
    navigate("/dash")
  }


  const goErrorPage = () =>{
    navigate("*")
  }

  return (
    <>
      <header>
        <nav>
        <NavLink to="/"><h1>HP Cloud</h1></NavLink>
          <div className="avtar">
          {
            loginData.ValidUserOne ? <Avatar style={{background:"blue"}} onClick={handleClick}>{loginData.ValidUserOne.fname[0].toUpperCase()}</Avatar>
            : <Avatar style={{background:"blue"}} onClick={handleClick} />
          }   
          </div>
          <Menu id="basic-menu" anchorEl={anchorEl} open={open} onClose={handleClose} MenuListProps={{'aria-labelledby': 'basic-button',}}>
                        {
                          loginData.ValidUserOne ? (
                                <>
                                    <MenuItem onClick={()=>{
                                        handleClose()
                                        goDash()
                                      } }>Profile</MenuItem>
                                    <MenuItem onClick={()=>{
                                        handleClose()
                                        logoutuser()
                                      }}>
                                      Logout
                                    </MenuItem>
                                </>) 
                                : 
                                (
                                <>
                                    <MenuItem onClick={()=>{
                                        handleClose()
                                        goErrorPage()
                                      }}>
                                      Profile
                                    </MenuItem>
                                </>
                            )
                        }
             </Menu>

        </nav>
      </header>
    </>
  )
}

export default Header