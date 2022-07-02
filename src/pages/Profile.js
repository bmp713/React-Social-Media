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
import ImageHeader from '../components/ImageHeader';
import Image from '../components/Image';
import Users from '../components/Users';
import News from '../components/News';

import {UserContext} from '../contexts/UserContext';

export default function Profile(){

    const { currentUser, login, logout, setCurrentUser, updateUserFirebase, deleteUserFirebase } = useContext(UserContext);

    const navigate = useNavigate();

    const logoutProfile = () => {
        updateUserFirebase(currentUser);
        logout();
        navigate('/');
    }

    // useEffect(() => {
    //     if( currentUser.email === null )
    //         navigate('/');
    // },[currentUser] );
    
    return(
        <div className='profile page'
            style={{
                // 302501,895539,277630,1041983,546927
                // background:'linear-gradient(#000d,#000d), url("https://source.unsplash.com/random/?abstract") no-repeat', 
                // background:'linear-gradient(#0007,#0007), url("./assets/10-(56).png") repeat',
                // backgroundSize:'100%'
            }}
        >
            <div className="header row justify-content-lg-left align-items-start">
                <div className="col-lg-6 text-left">
                    <div 
                        className="row justify-content-lg-left align-items-center">
                        <div className="col-lg-10 text-left my-3">
                            <div style={{fontSize:'15px',lineHeight:'1.2'}}>
                                <h2>                            
                                    {currentUser.first} {currentUser.last}
                                </h2>
                                {currentUser.email}<br></br>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-6 py-2 text-lg-end">
                    <p className="profile-settings ">
                        <span style={{color:'#4267d9'}}>{currentUser.email}</span> is signed in
                        <img 
                                width="40" height="40" className="m-2" 
                                style={{borderRadius:'50%'}}
                                src={currentUser.imgURL} 
                                alt="new"
                        />
                        <button onClick={logoutProfile} className="app-btn">Sign Out</button><br></br>
                        <a href
                            className="mx-2 text-white"
                            onClick={ () => {
                                console.log("deleteUserFIrebase => ", currentUser.id);
                                deleteUserFirebase(currentUser);
                                setCurrentUser('');
                                navigate('/');
                            } }
                        >
                            Delete Account
                        </a>
                        <span><img width="20px" className="m-3" src="./assets/Icon-gear-white.png" alt='new'/></span>
                    </p>
                </div>
            </div>
            <div className="row justify-content-lg-center align-items-start">
                <div className="col-lg-5 text-left m-lg-1">
                    <Friends/>
                    <Gallery/>
                    <Users/>
                    <News/>
                    <Image/>

                </div>
                <div className="col-lg-5 text-left my-lg-1">
                    <Messages/>
                </div>
                <div className="col-lg-5 text-left my-lg-1">

                </div>
            </div>
        </div>  
    )
}



