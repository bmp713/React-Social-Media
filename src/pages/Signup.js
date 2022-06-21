/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-unused-vars */

import '../App.scss';
import React, { useState, useEffect, useContext } from 'react';
import {Link, Route, Routes, useNavigate, BrowserRouter as Router, Navigate} from 'react-router-dom';
//import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from "firebase/auth";

import {UserContext} from '../contexts/UserContext';

export default function Signup(){

    const { currentUser, login, signup, logout } = useContext(UserContext);

    const [ name, setName ] = useState('');
    const navigate = useNavigate();

    const [msgSubmit, setMsgSubmit] = useState( { message: '', color: 'red'} )
    const [passwordShow, setPasswordShow] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const signupUserPassword = (e) => {
        e.preventDefault();

        if( !( formData.first && formData.last && formData.email && formData.password ) ){
            setMsgSubmit({
                message: 'Please fill in all input fields',
                color: 'red'
            });               
            return;
        }
        
        signup(formData.first, formData.last, formData.email, formData.password)
            .then( () => {
                console.log(currentUser, "succesfully signed up" );
  
                login(formData.email, formData.password)
                    .then( () => {
                        navigate('/profile');
                    })
                    .catch( (error) => {
                        console.log("Signup.js => login() =>", error);
                        setMsgSubmit({
                            message: error.toString(),
                            color: 'red'
                        });  
                    });
            })
            .catch( (error) => {
                console.log("Signup.js => signup() =>", error);
                setMsgSubmit({
                    message: error.toString(),
                    color: 'red'
                });  
            });
    }

    return(
        <div className="signup">
            <div className="row signup justify-content-lg-center align-items-center">
                <div className="col-lg-5 text-start">
                    <div className="col-lg-10 text-left p-3">
                        <h1>Sign Up</h1>
                        <h2>Connect Today and Change The World</h2>
                    </div>
                    <div className="App-modal text-left">        
                        <form id='form'>
                            <h2>Sign Up</h2>
                            <input 
                                value={formData.name} 
                                onChange={ function(e){ setFormData({...formData, first: e.target.value}) } } 
                                type="text" placeholder="First Name"
                            /><br></br>
                            <input 
                                value={formData.name} 
                                onChange={ function(e){ setFormData({...formData, last: e.target.value}) } } 
                                type="text" placeholder="Last Name"
                            /><br></br>
                            <input 
                                value={formData.email} 
                                onChange={ function(e){ setFormData({...formData, email: e.target.value}) } }    
                                type="text" placeholder="Email"
                            /><br></br>
                                <div className="eye-container">
                                    <input 
                                        value={formData.password} 
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                        type={ passwordShow ? "text" : "password" } 
                                        name="password" 
                                        placeholder="Password"
                                    />
                                    <a
                                        className="btn-invisible"
                                        onClick={() =>{ passwordShow ? setPasswordShow(false) : setPasswordShow(true) }}>
                                        <img
                                            id="eye" className="eye"
                                            src={ passwordShow ? "./assets/Icon-eye-open.png" : "./assets/Icon-eye-closed.png"} alt="new"
                                        />
                                    </a>
                                </div>
                            <input 
                                onClick={signupUserPassword}
                                className="submit-btn" type="submit" value="Sign Up"
                            /><br></br>
                            <p style={{marginLeft:"10px", color:msgSubmit.color, fontSize:"14px"}}>{msgSubmit.message}</p>

                            <div className="row justify-content-lg-center align-items-stretch">
                                <div className="col-lg-11 text-right px-2">
                                    <span style={{fontSize: "10px"}}>* By clicking "Sign Up",  you are agreeing to the Terms of Service and Privacy policy.</span>
                                    <br></br><br></br>
                                    <p>Already have an account? <Link to='/' className=".App-btn"><strong>Sign In</strong></Link><br></br></p>
                                </div>
                            </div>
                        </form>
                        <div className="row justify-content-lg-center align-items-stretch">
                            <div className="col-lg-6 text-center">
                                <span><button className=".app-btn">
                                    <img width='75' src="./assets/Icon-facebook.png" alt="new"/>
                                </button></span>
                                <span><button className=".app-btn">
                                    <img width='75' src="./assets/Icon-google.png" alt="new"/>
                                </button></span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-5 text-right px-5">
                    <img className="w-100" src="./assets/Devices7.png" alt="new"/>
                </div>
            </div>
        </div>

    )
}












