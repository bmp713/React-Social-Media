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
        let data = await getDocs( collection(db, 'users') );

        // Copy all data to messages state array
        setFriends( data.docs.map( (doc) => ({
            ...doc.data()
        }) ) );
        
        friends.forEach( (friend) => {
            setFriendsCount( friendsCount => friendsCount + 1 );
            console.log('friend.id => ' + friend.id );
        });
        //console.log("currentUser.friends =>", currentUser.friends);
    };
    
    const deleteFriend = async (id) => {
        console.log('deleteDoc(id) => ' + id);
        try{
            await deleteDoc( doc(db, 'friends', id) );
            readFriends();
        }catch(error){
            console.log(error);
        }
    };

    // const createFriend = async (e) => {
    //     e.preventDefault();
    //     if( !formData.name || !formData.email ){
    //         setError(true);
    //         return;
    //     }
    //     else setError(false);
    //     // Create new friend
    //     let docRef;
    //     try{
    //         docRef = await addDoc( collection(db, 'friends'), {});
    //         console.log('id => '+ docRef.id);
    //     }catch(error){
    //         console.log(error);
    //     }
    //     // Generate random headshot image with fetch API
    //     await fetch('https://source.unsplash.com/collection/928423/480x480', {
    //         headers: {'Content-Type':'application/json'},
    //         crossDomain: true,
    //         mode: 'no-cors',
    //         method: 'GET'
    //     })
    //         .then( data => {
    //             console.log("Fetch image =>", data );
    //         } )
    //         .catch( error => {
    //             console.log("Fetch error => ", error);
    //         });
    //     // https://unsplash.com/collections/895539,302501,277630,1041983
    //     // https://source.unsplash.com/collection/{collectionID}/{imageWidth}x{imageHeight}/?sig=randomNumber
    //     // https://source.unsplash.com/collection/collectionID/400x600/?sig=imageID
    //     // Generate random headshot image
    //     let random = Math.floor(Math.random() * 100000);
    //     let urlImg = `https://source.unsplash.com/collection/895539/400x400/?sig=`+ random;
    //     // Update friend document
    //     await setDoc( doc(db, 'friends', docRef.id.toString()), {
    //         id: docRef.id,
    //         userId: currentUser.id,
    //         name: formData.name,
    //         email: formData.email,
    //         imageURL: formData.image? formData.image : urlImg
    //     })
    //     readFriends();
    // };

    return(
        <div className='friends my-2'>
            <div className="row justify-content-lg-center align-items-start p-lg-5 p-0">
                <div className="col-lg-12 text-left">
                    {/* <h2>Friends ({friendsCount})</h2>   */}
                    <h2>Friends</h2> 
                </div>
                {/* { console.log("Friends.js", currentUser.friends) } */}
                {friends.map( (user) => 
                    //  currentUser.friends.includes( user.id ) ?  
                        <div className="col-lg-3 col-12" id={user.id} key={user.id}>
                            <img className="my-2" height="150" src={user.imgURL} alt="new"/>
                            <p style={{fontSize:'15px'}}>
                                {user.first} {user.last}<br></br>
                                {/* {user.email}<br></br> */}
                            </p>
                            {/* <span><button 
                                onClick={ () => { deleteFriend(user.id) } } 
                                className="Del-btn">Delete
                            </button></span>
                            <hr></hr> */}
                        </div>
                        // : ''
                )}                
            </div>
        </div>  
    )
}



