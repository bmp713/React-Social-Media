/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import '../App.scss';
import React, { useState, useEffect, useContext } from 'react';
import { doc, addDoc, setDoc, getDocs, deleteDoc, collection } from 'firebase/firestore';
import { db } from '../Firebase';

import {UserContext} from '../contexts/UserContext';

export default function Users(){

    // User authentication
    const { currentUser, setCurrentUser, updateUserFirebase, login, logout } = useContext(UserContext);

    const [profilessCount, setprofilessCount] = useState(0);
    const [profiless, setprofiless] = useState([]);
    const [error, setError] = useState(false);
    
    const [formData, setFormData] = useState({
    });

    useEffect(() => {
        readprofiles();
    },[]);

    const readprofiles = async () => {
        let data = await getDocs( collection(db, 'users') );

        // Copy all data to messages state array
        setprofiless( data.docs.map( (doc) => ({
            ...doc.data()
        }) ) );
        
        profiless.forEach( (friend) => {
            setprofilessCount( profilessCount => profilessCount + 1 );
            console.log('friend.id => ' + friend.id );
        });
    };

    const addFriend = async (id) => {
        console.log("addFriend =>", id);
        // setCurrentUser({
        //     id: currentUser.id,
        //     name: currentUser.name,
        //     first: currentUser.first,
        //     last: currentUser.last,
        //     imgURL: currentUser.imgURL,
        //     profiless: currentUser.profiless.concat(",", id)        
        // })   
        //updateUserFirebase(currentUser);  
        console.log("addFriend() =>", currentUser.friends);

    };

    return(
        <div className='friends my-2'>
            <div className="row justify-content-lg-center align-items-center p-5">
                <div className="col-lg-12 text-leftr">
                    <h2>Users</h2> 
                </div>
                {profiless.map( (user) => (
                    <div className="col-lg-2" id={user.id} key={user.id}>
                        <img className="my-2" height="150" src={user.imgURL} alt="new"/>
                        <p style={{fontSize:'15px'}}>
                            {user.first} {user.last} 
                            {/* {user.email} */}<br></br>
                            <button 
                                onClick={ () => { addFriend(user.id) } } 
                                style={{
                                    textDecoration:"underline", 
                                    lineHeight:"0.5",
                                    color:"#ffff",
                                    fontSize:"15px", 
                                    padding:'0px'
                                }}>+ Add
                        </button>
                        </p>

                    </div>
                ))}                
            </div>
        </div>  
    )
}



