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
        <div className='profile page' >
            <div className="header row justify-content-lg-left align-items-start">
                <div className="col-lg-6 text-left">
                    <h1>Profile</h1>
                    <p className="profile-details">
                    {currentUser.first} {currentUser.last}<br></br>
                    {currentUser.name}<br></br>
                    </p>
                </div>
                <div className="profile-settings col-lg-6 py-2 text-lg-end">
                    <p>
                        <span style={{color:'#07ff'}}>{currentUser.name}</span> is signed in
                        <span><img width="20px" className="mx-3" src="./assets/Icon-gear-white.png" alt='new'/></span>
                        <button onClick={logoutProfile} className="App-btn">Sign Out</button> 
                    </p>
                </div>
            </div>
            <div className="row justify-content-lg-center align-items-start">
                <div className="col-lg-5 text-left m-1">
                    <Friends/>
                </div>
                <div className="col-lg-5 text-left m-1">
                    <Messages/>
                </div>
                <div className="col-lg-10 text-left m-1">
                    <Gallery/>
                </div>
                <div className="col-lg-10 text-left m-1">
                    <Users/>
                </div>
            </div>
        </div>  
    )
}












