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
    const [error, setError] = useState(false);

    const navigate = useNavigate();
    const [friends, setFriends] = useState([]);
    let data = '';

    const [formData, setFormData] = useState({
        id:"",
        name: "",
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

        if( !formData.name || !formData.email ){
            setError(true);
            return;
        }
        else setError(false);

        //console.log('createFriend() => ' + id + ' ' + formData.first + ' ' + formData.last + ', ' + formData.email);

        // Create new user
        let docRef;
        try{
            docRef = await addDoc( collection(db, 'friends'), {});
            console.log('id => '+ docRef.id);
        }catch(error){
            console.log(error);
        }

        // Generate random headshot image with fetch API
        await fetch('https://source.unsplash.com/collection/928423/480x480', {
            headers: {'Content-Type':'application/json'},
            crossDomain: true,
            mode: 'no-cors',
            method: 'GET'
        })
            .then( data => {
                console.log("Fetch image =>", data );
            } )
            .catch( error => {
                console.log("Fetch error => ", error);
            });
        
        // Unsplash collection IDs
        // https://unsplash.com/collections/
        // https://unsplash.com/collections/895539/faces
        // https://source.unsplash.com/collection/collectionID/imageWidth%7DximageHeight/?sig=randomNumber`
        //
        // let url = 'https://source.unsplash.com/collection/collectionID/400x400/?sig=100';

        let random = Math.floor(Math.random() * 100000);
        let urlImg = `https://source.unsplash.com/collection/895539/400x400/?sig=` + random;

        // Update friend document
        await setDoc( doc(db, 'friends', docRef.id.toString()), {
            id: docRef.id,
            name: formData.name,
            email: formData.email,
            imageURL: urlImg
        })



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
                        <img className="my-2" height="200" src={user.imageURL} alt="new"/>
                        <p>
                            {/* {user.id}<br></br> */}
                            {user.name} <br></br>
                            {user.email}<br></br>
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
                            <div className="row text-left m-2">
                                <h4>Add Friend</h4>  
                            </div>  
                            <input 
                                value={formData.name} 
                                onChange={ function(e){ setFormData({...formData, name: e.target.value}) } }    
                                type="text" placeholder="Full Name"
                            /><br></br>
                            <input 
                                value={formData.email} 
                                onChange={ function(e){ setFormData({...formData, email: e.target.value}) } }    
                                type="text" placeholder="Email"
                            /><br></br>
                            <input className="submit-btn" type="submit" value="Add"/><br></br>
                            { error ? <p className="text-danger mx-2"> Please fill in all fields</p> : '' }
                        </form>
                        <br></br>
                    </div>
                </div>
            </div>
        </div>  
    )
}



