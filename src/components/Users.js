/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import '../App.scss';
import React, { useState, useEffect, useContext } from 'react';
import { doc, addDoc, setDoc, getDocs, deleteDoc, collection } from 'firebase/firestore';
import { db } from '../Firebase';

import {UserContext} from '../contexts/UserContext';

export default function Friends(){

    // User authentication
    const { currentUser, login, logout } = useContext(UserContext);

    const [friendsCount, setFriendsCount] = useState(0);
    const [friends, setFriends] = useState([]);
    const [error, setError] = useState(false);
    
    const [formData, setFormData] = useState({
    });

    useEffect(() => {
        readFriends();
    },[]);

    const readFriends = async () => {
        let data = await getDocs( collection(db, 'friends') );

        // Copy all data to messages state array
        setFriends( data.docs.map( (doc) => ({
            ...doc.data()
        }) ) );
        
        friends.forEach( (friend) => {
            setFriendsCount( friendsCount => friendsCount + 1 );
            console.log('friend.id => ' + friend.id );
        });
    };

    const addFriend = async (e) => {
        e.preventDefault();

        if( !formData.name || !formData.email ){
            setError(true);
            return;
        }
        else setError(false);

        // Create new friend
        let docRef;
        try{
            docRef = await addDoc( collection(db, 'friends'), {});
            console.log('id => '+ docRef.id);
        }catch(error){
            console.log(error);
        }

        // Update friend document
        await setDoc( doc(db, 'friends', docRef.id.toString()), {
            id: docRef.id,
            userId: currentUser.id,
            name: formData.name,
            email: formData.email,
            // imageURL: formData.image? formData.image : urlImg
        })
        readFriends();
    };

    return(
        <div className='friends my-2'>
            <div className="row justify-content-lg-center align-items-center p-5">
                <div className="col-lg-12 text-center">
                    <h2>Profiles</h2> 
                </div>
                {friends.map( (user) => (
                    <div className="col-lg-1" id={user.id} key={user.id}>
                        <img className="my-2" height="100" src={user.imageURL} alt="new"/>
                        <p>
                            {user.name} <br></br>
                        </p>
                    </div>
                ))}                
            </div>
        </div>  
    )
}



