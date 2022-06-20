/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-unused-vars */

import '../App.scss';
import React, { useState, useEffect, useContext } from 'react';
import {Link, Route, Routes, useNavigate, BrowserRouter as Router, Navigate} from 'react-router-dom';
import { doc, addDoc, setDoc, getDocs, deleteDoc, collection } from 'firebase/firestore';
import { db } from '../Firebase';

import Friends from '../components/Friends';
import Gallery from '../components/Gallery';
import Messages from '../components/Messages';
import Users from '../components/Users';


import {UserContext} from '../contexts/UserContext';

export default function Profile(){

    const { currentUser, login, logout } = useContext(UserContext);
    const navigate = useNavigate();

    const logoutProfile = () => {
        logout();
        navigate('/');
    }

    return(
        <div className='profile page'
            style={{
                // 302501,895539,277630,1041983,546927
                // background:'linear-gradient(#000a,#000a), url("https://source.unsplash.com/random/?abstract") no-repeat', 
                // backgroundSize:'cover'
            }}
        >
            <div className="header row justify-content-lg-left align-items-start">
                <div className="col-lg-6 text-left">
                    <h1>Profile</h1>
                    <div className="row justify-content-lg-left align-items-center">
                        <div className="col-lg-10 text-left m-1">
                            <div style={{fontSize:'15px',lineHeight:'1.2'}}>
                                {currentUser.first} {currentUser.last}<br></br>
                                {currentUser.name}<br></br>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-6 py-2 text-lg-end">
                    <p className="profile-settings">
                        <span style={{color:'#4267d9'}}>{currentUser.name}</span> is signed in
                        <img 
                                width="40"
                                height="40" 
                                className="mx-3" 
                                src={currentUser.imgURL} 
                                style={{borderRadius:'50%'}}
                                alt="new"
                        />
                        <button onClick={logoutProfile} className="app-btn">Sign Out</button><br></br>
                        <span>Settings<img width="20px" className="m-3" src="./assets/Icon-gear-white.png" alt='new'/></span>
                    </p>
                </div>
            </div>
            <div className="row justify-content-lg-center align-items-start">
                <div className="col-lg-5 text-left m-1">
                    <Friends/>
                    <Gallery/>
                </div>
                <div className="col-lg-5 text-left m-1">
                    <Messages/>
                </div>
                <div className="col-lg-10 text-left m-1">
                    <Users/>
                </div>
                <div className="col-lg-10 text-left m-1">
                </div>
            </div>
        </div>  
    )
}












