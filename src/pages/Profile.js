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

import {UserContext} from '../contexts/UserContext';

export default function Profile(){

    const { currentUser, login, logout } = useContext(UserContext);
    const [file, setFile] = useState("");

    const [formData, setFormData] = useState({
        message: "",
    });
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const [messages, setMessages] = useState([]);

    let data = '';

    useEffect(() => {
        readMessages();
    },[]);
    
    const logoutProfile = () => {
        logout();
        navigate('/');
    };



    //Read messages from Firebase
    const readMessages = async () => {
        console.log("readMessages");
        data = await getDocs( collection(db, 'messages') );
        setMessages( 
            data.docs.map( (doc) => 
                ({ ...doc.data() }) 
            ) 
        );
        console.log("data =>", data.docs);
        console.log("messages =>", messages);
    };
    
    const createMessage = async (e) => {
        e.preventDefault();
        console.log("createMessage");
        if( !formData.message ) {
            setError(true);
            return;
        }

        // Create new user
        let docRef;

        //setFile(e.target.files[0]);
        //console.log("form inputs => ", e.target.files[0]);

        try{
            docRef = await addDoc( collection(db, 'messages'), {});
            console.log('id => '+ docRef.id);
            readMessages();
        }catch(error){
            console.log(error);
        }
        await setDoc( doc(db, 'messages', docRef.id.toString()), {
            id: docRef.id,
            email: currentUser.name,
            message: formData.message
        })
        console.log('createMessage() => ' + docRef.id + ' ' + currentUser.name + ', ' + formData.message);
    };  

    const deleteMessage = async (id) => {
        console.log('deleteDoc(id) => ' + id);
        try{
            await deleteDoc( doc(db, 'messages', id) );
            readMessages();
        }catch(error){
            console.log(error);
        }
    };

    const editMessage = async (id) => {
        console.log('editDoc(id) => ' + formData.message);
        try{
            await setDoc( doc(db, 'messages', id ), {
                id: id,
                email: currentUser.name,
                message: formData.message
            })
            readMessages();
        }catch(error){
            console.log(error);
        }
    };

    return(
        <div className='profile page' 
            >
            <div className="header row justify-content-lg-left align-items-start">
                <div className="col-lg-6 text-left">
                    <h1>Profile</h1>
                    <p className="profile-details">
                    {/* <img className="my-2" height="250" src={currentUser.imgURL} alt="new"/> */}
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
                <div className="col-lg-5 text-left">
                <Friends/>
                <Gallery/>
                </div>
                <div 
                    className="messages col-lg-5 text-left" 
                    style={{
                        background:'linear-gradient(#3579,#000f), url("https://source.unsplash.com/random/?abstract") no-repeat fixed', 
                        backgroundSize:'cover'
                    }}
                >
                    <h4 className="mx-2">Messages</h4>  
                    {messages.map( (user) => (
                        <div className="p-3" id={user.id} key={user.id}>
                            {/* <img className="my-2" height="250" src="https://source.unsplash.com/random/?productivity,city" alt="new"/> */}
                            <p className="my-4">
                                {user.message}<br></br>
                                <strong>{user.email}</strong><br></br>
                                <span style={{fontSize:'10px'}}>{user.id}</span><br></br>
                            </p>
                            <span>
                            { (currentUser.name !== user.email) ? '' :
                                <div>
                                    <button 
                                        onClick={ () => { editMessage(user.id) } } 
                                        className="App-btn">Edit
                                    </button>
                                    <button 
                                        onClick={ () => { deleteMessage(user.id) } } 
                                        className="btn-black">Delete
                                    </button>
                                    <p style={{fontSize:'12px'}}>Enter new message in form and click Edit</p>
                                </div>
                            }
                            </span>
                            <hr></hr>
                        </div>
                    ))} 
                    <div className="App-modal create text-left">        
                        <form id='form' >
                            <h2>Post</h2>
                            <input 
                                value={formData.message} 
                                onChange={ function(event){ 
                                    setFormData({...formData, message: event.target.value}) 
                                    event.target.value ? setError(false) : setError(true)
                                } }    
                                type="textarea" placeholder="Type your message here"
                            /><br></br>
                            <input 
                                value={formData.file} 
                                onChange={ function(e){ setFormData({...formData, file: e.target.value}) } }    
                                type="file" placeholder=""
                            /><br></br>
                            <input 
                                onClick={createMessage}
                                className="submit-btn" type="submit" value="Send"/><br></br>
                                { error ? <p className="text-danger mx-2"> Please enter a message</p> : '' }
                        </form>
                        <br></br>
                    </div>
                </div>
            </div>
        </div>  

    )
}












