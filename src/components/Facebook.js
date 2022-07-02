/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import '../App.scss';
import React, { useState, useEffect, useContext } from 'react';
import { doc, query, where, addDoc, setDoc, getDoc, getDocs, deleteDoc, collection } from 'firebase/firestore';
import { db } from '../Firebase';
import { storage } from '../Firebase';
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";

import FacebookLogin from 'react-facebook-login';

import {UserContext} from '../contexts/UserContext';

// YouTube API Key
//AIzaSyA5JEadZzVUBGMrn0dygRdx5t-5uqAuBKo 

export default function Facebook(){

    const [data, setData] = useState({});
    const [login, setLogin] = useState(false);
    const [picture, setPicture] = useState('');
  
    const responseFacebook = (response) => {
        console.log("Facebook =>", response);

        setData(response);
        console.log("Facebook data =>", response);
        console.log("Facebook data picture =>", response.picture.data);
        response.picture.data.height = 200;

        setPicture(response.picture.data.url);
        if (response.accessToken) {
            setLogin(true);
        } else {
            setLogin(false);
        }
    }
  
    return (
        <div class="container">
            <div style={{ width: '500px', }}>
                {!login &&
                    <FacebookLogin
                        appId="449620683654719"
                        autoLoad={true}
                        fields="name,email,picture"
                        scope="public_profile,user_friends"
                        callback={responseFacebook}
                        icon="fa-facebook" 
                    />
                }
                {login &&
                    <img width="10%" src={picture} alt=''/>
                }
                {login &&
                    <h2 className="text-white">
                        {data.name},
                        {data.email}
                    </h2>
                }
            </div>
        </div>
    );
}



