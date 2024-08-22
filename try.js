import React, { useState, useEffect } from "react";
import axios from "axios";
import "../style/m_login.css";
import { useNavigate } from "react-router-dom";
import factory from "../ethereum/factory";
import web3 from "../ethereum/web3";
import "@fortawesome/fontawesome-free/css/all.css";
import { toast } from "react-toastify";

const ManufacturerLogin = (props) => {
  const [id, setId] = useState("");
  const [brand, setBrand] = useState("");
  const [city, setCity] = useState("");
  const [pass, setPassword] = useState("");
  const [loading, setLoading] = useState("");
  let [flag, setFlag] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const registerBtn = document.getElementById("registerM");
    const loginBtn = document.getElementById("loginM");

    const handleRegisterClick = () => {
      document.getElementById("containerM").classList.add("active");
    };

    const handleLoginClick = () => {
      document.getElementById("containerM").classList.remove("active");
    };

    registerBtn.addEventListener("click", handleRegisterClick);
    loginBtn.addEventListener("click", handleLoginClick);

    return () => {
      registerBtn.removeEventListener("click", handleRegisterClick);
      loginBtn.removeEventListener("click", handleLoginClick);
    };
  }, []);

  const handleSignUp = async (event) => {
    event.preventDefault();
    const icon = event.currentTarget.querySelector("i");

    icon.classList.add("fa", "fa-spinner", "fa-pulse");

    try {
      // console.log(response.data);
      const accounts = await web3.eth.getAccounts();
      await factory.methods
        .createManufacturer(id, brand)
        .send({ from: accounts[0], gas: "20000000" });

      const res = await axios.post("https://server-iyuf-git-main-amol29102s-projects.vercel.app/brand", {
        id,
      });

      toast.success("Account Created Successfully!", {
        position: "top-center",
        autoClose: 2500,
      });

      const response = await axios.post(
        "https://server-iyuf-git-main-amol29102s-projects.vercel.app/m_signup",
        {
          id,
          brand,
          city,
          pass,
        }
      );

      props.setBrandName(res.data.manuf_brand);
      props.setCity(res.data.manuf_city);
      props.setManuId(res.data.manuf_id);

      if (response.data === "Successfully signed in") {
      } else {
        // alert("Signup unsuccessful");
      }
      console.log(response.data);
    } catch (error) {
      toast.error("Error in Creating Account!", {
        position: "top-center",
        autoClose: 2500,
      });
      console.error("Error signing up:", error);
    }
    icon.classList.remove("fa", "fa-spinner", "fa-pulse");
  };
  //   let flag = 0;
  const handleLoadingSignIn = (event) => {
    try {
      if (flag == 2) {
        // alert('corrrect flag')
        const icon = event.currentTarget.querySelector("i");

        icon.classList.add("fa", "fa-spinner", "fa-pulse");

        // Set timeout to remove classes
        setTimeout(function () {
          icon.remove("fa", "fa-spinner", "fa-pulse");
        }, 1500);
      } else {
        // alert("fill the details");
        setFlag(0);
      }
    } catch {}
  };
  const handleSignIn = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "https://server-iyuf-git-main-amol29102s-projects.vercel.app/m_signin",
        {
          id,
          pass,
        }
      );

      if (response.data === "Successfully signed in") {
        const res = await axios.post("https://server-iyuf-git-main-amol29102s-projects.vercel.app/brand", {
          id,
        });
        console.log(res);
        props.setBrandName(res.data.manuf_brand);
        props.setCity(res.data.manuf_city);
        props.setManuId(res.data.manuf_id);
        const Manuaddress = await factory.methods
          .getManufacturerInstance(res.data.manuf_brand)
          .call();
        props.setAddress(Manuaddress);
        toast.success("Login Successful!", {
          position: "top-center",
          autoClose: 2000,
        });
        navigate("/manufacturer", {
          state: {
            brand: res.data.manuf_brand,
            id: res.data.manuf_id,
            city: res.data.manuf_city,
          },
        });
      } else {
        // alert("Login unsuccessful else");
      }
      console.log(response.data);
    } catch (error) {
      console.error("Error signing in:", error);
      toast.error("Login Unsucessfull!", {
        position: "top-center",
        autoClose: 2500,
      });
    }
  };

  return (
    <>
      <div className="whole_page">
        <div className="container" id="containerM">
          <div className="form-container sign-up">
            <form onSubmit={handleSignUp}>
              <h1>Create Account</h1>
              <input
                required
                type="text"
                placeholder="Manufacturer ID"
                value={id}
                onChange={(e) => setId(e.target.value)}
              />
              <input
                required
                type="text"
                placeholder="Manufacturer Brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
              <input
                required
                type="text"
                placeholder="Manufacturer City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <input
                required
                type="password"
                placeholder="Password"
                value={pass}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit" className="buttonload">
                <i></i>Sign Up
              </button>
            </form>
          </div>
          <div className="form-container sign-in">
            <form onSubmit={handleSignIn}>
              <h1>Sign In</h1>
              <input
                required
                type="text"
                placeholder="Manufacturer ID"
                value={id}
                onChange={(e) => {
                  setId(e.target.value);

                  setFlag(1);
                }}
              />
              <input
                required
                type="password"
                placeholder="Password"
                value={pass}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (flag == 1) {
                    setFlag(2);
                  }
                }}
              />
              <button
                type="submit"
                onClick={(event) => handleLoadingSignIn(event)}
              >
                {" "}
                <i></i>Sign In
              </button>
            </form>
          </div>
          <div className="toggle-container">
            <div className="toggle">
              <div className="toggle-panel toggle-left">
                <h1> Already Registerd? </h1>
                <p>Sign in to proceed further</p>
                <button className="hidden" id="loginM">
                  Sign In
                </button>
              </div>
              <div className="toggle-panel toggle-right">
                <h1>New User?</h1>
                <p>
                  Put your personal details to Register and use all the features
                  of the site.
                </p>
                <button className="hidden" id="registerM">
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManufacturerLogin;