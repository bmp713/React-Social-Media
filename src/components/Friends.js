/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import '../App.scss';
import { useState, useEffect } from 'react';
import { Link, useNavigate} from 'react-router-dom';

import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, addDoc, setDoc, getDocs, deleteDoc, collection } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db } from '../Firebase';

//import CreateFriend from './CreateFriend';
//import Create from './Create';
//import Delete from './Delete';

export default function Friends(){

    // User authentication
    const auth = getAuth();
    const [user] = useAuthState(auth);

    const navigate = useNavigate();
    const [friends, setFriends] = useState([]);
    let data = '';

    const [formData, setFormData] = useState({
        id:"",
        email: "",
        // password: ""
    });

    useEffect(() => {
        //console.log(`user => ${auth.currentUser.email} `);
        readFriends();
    },[]);

    const readFriends = async () => {
        data = await getDocs( collection(db, 'friends') );

        // Copy all data to messages state array
        setFriends( data.docs.map( (doc) => ({
            ...doc.data()
        }) ) );
        
        friends.forEach( (friend) => {
            console.log(friend);
            console.log('friend.id => ' + friend.id );
        });
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

    const createFriend = async (e) => {
        e.preventDefault();

        let id = Math.floor(Math.random() * 10000000)
        //console.log('createFriend() => ' + id + ' ' + formData.first + ' ' + formData.last + ', ' + formData.email);

        // Create new user
        let docRef;
        try{
            docRef = await addDoc( collection(db, 'friends'), {});
            console.log('id => '+ docRef.id);
        }catch(error){
            console.log(error);
        }
        await setDoc( doc(db, 'friends', docRef.id.toString()), {
            id: docRef.id,
            email: formData.email,
        })

        // Random images
        // https://picsum.photos/200
        // https://picsum.photos/200/300
        // https://fakeface.rest/face/json
        // https://source.unsplash.com/random/800x800/?img=1
        // https://100k-faces.glitch.me/random-image
        // https://github.com/ozgrozer/100k-faces
        // https://i.pravatar.cc/300
        // https://source.unsplash.com/random
        // https://source.unsplash.com/random/?productivity,city

        readFriends();
    };

    return(
        <div className='friends'>
            <div className="row justify-content-lg-center align-items-start">
                <div className="col-lg-10 text-left">
                    <h2>Friends</h2>  
                </div>
                {friends.map( (user) => (
                    <div className="col-lg-5" id={user.id} key={user.id}>
                        <img className="my-2" height="150" src="https://100k-faces.glitch.me/random-image" alt="new"/>
                        <p>
                            {user.id}<br></br>
                            {/* {user.first} {user.last}<br></br> */}
                            {user.email}<br></br><br></br>
                        </p>
                        <span><button 
                            onClick={ () => { deleteFriend(user.id) } } 
                            className="App-btn">Delete
                        </button></span>
                        <hr></hr>
                    </div>
                ))}                
                <div className="col-lg-10 text-left">
                    <div className="create text-left">        
                        <form id='form' onSubmit={createFriend}>
                            <input 
                                value={formData.email} 
                                onChange={ function(e){ setFormData({...formData, email: e.target.value}) } }    
                                type="text" placeholder="Email"
                            /><br></br>
                            <input className="submit-btn" type="submit" value="Add"/><br></br>
                        </form>
                        <br></br>
                    </div>
                </div>
            </div>
        </div>  
    )
}



