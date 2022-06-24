/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import '../App.scss';
import React, { useRef, useState, useEffect, useContext } from 'react';
import { doc, addDoc, setDoc, getDoc, getDocs, deleteDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../Firebase';
import { storage } from '../Firebase';
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";

import {UserContext} from '../contexts/UserContext';

export default function Messages(){

    // User authentication
    const {currentUser, login, logout } = useContext(UserContext);
    const [messagesCount, setMessagesCount] = useState(0);
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState(false);

    const [showMenuID, setShowMenuID] = useState(null);
    const [showMenu, setShowMenu] = useState(true);

    const [formData, setFormData] = useState({});

    const [likes, setLikes] = useState(0);
    const [likeID, setLikeID] = useState();

    useEffect(() => {
        readMessages();
    },[]);

    //Read messages from Firebase
    const readMessages = async () => {

        let data = await getDocs( collection(db, 'messages') );
        setMessages( 
            data.docs.map( (doc) => 
                ({ ...doc.data() }) 
            ) 
        );
        console.log("data =>", data.docs);
        console.log("messages =>", messages);
    };
    
    //Read message from Firebase
    const readMessage = async (id) => {

        let data = await doc( collection(db, 'messages', id) );
        console.log("readMessage() data =>", data);
    };

    const createMessage = async (e) => {

        e.preventDefault();
        console.log("createMessage");
        //document.querySelector('form').reset();

        if( !formData.message ) {
            setError(true);
            return;
        }
        
        // Add new message to database
        let docRef;
        try{
            docRef = await addDoc( collection(db, 'messages'), {});
            console.log('id => '+ docRef.id);
            readMessages();
        }catch(error){
            console.log(error);
        }
        await setDoc( doc(db, 'messages', docRef.id.toString()), {
            id: docRef.id,
            email: currentUser.email,
            first: currentUser.first,
            last: currentUser.last,
            message: formData.message,
            userImg: currentUser.imgURL,
            likes: 0
        })
    };  

    const deleteMessage = async (id) => {
        console.log('deleteDoc(id) => ' + id);
        setShowMenu( !showMenu );

        try{
            await deleteDoc( doc(db, 'messages', id) );
            readMessages();
        }catch(error){
            console.log(error);
        }
    };

    const editMessage = async (id) => {
        setShowMenu( !showMenu );

        console.log('editDoc(id) => ' + formData.message);
        try{
            await setDoc( doc(db, 'messages', id ), {
                id: id,
                email: currentUser.email,
                first: currentUser.first,
                last: currentUser.last,
                message: formData.message,
                userImg: currentUser.imgURL
            })
            readMessages();
        }catch(error){
            console.log(error);
        }
    };

    const updateMessage = async (id) => {
        console.log('updateMessage(id) likes =>', id);

        try{
            let data = await doc( db, 'messages', id );
            const docSnap = await getDoc(data);

            console.log("readMessage() docSnap.data() =>", docSnap.data());
            console.log("readMessage() docSnap.data() =>", docSnap.data().id);
            console.log("readMessage() docSnap.data() =>", docSnap.data().email);
            console.log("readMessage() docSnap.data() =>", docSnap.data().first);
            console.log("readMessage() docSnap.data() =>", docSnap.data().last);



            let newLikes = docSnap.data().likes + 1; 
            console.log("newLikes =>", newLikes);
            try{
                await setDoc( doc(db, 'messages', id ), {
                    id: docSnap.data().id,
                    email: docSnap.data().email,
                    first: docSnap.data().first,
                    last: docSnap.data().last,
                    message: docSnap.data().message,
                    userImg: docSnap.data().userImg,
                    likes: newLikes
                })
                readMessages();
            }catch(error){
                console.log(error);
            }
            readMessages();
        }catch(error){
            console.log(error);
        }
    };

    const msgMenuClicked = (e) => {
        console.log("e.currentTarget.id => ", e.currentTarget.id);
        setShowMenuID(e.currentTarget.id);
        setShowMenu( !showMenu );
    }

    const likeClicked = (e) => {
        console.log("like clicked => e.currentTarget.id => ", e.currentTarget.id);
        setLikeID(e.currentTarget.id);
    }

    return(
        <div 
            className="messages row text-left align-items-center p-lg-5 p-4 my-2" 
            style={{
                background:'linear-gradient(#0066ccaa,#000a), url("https://source.unsplash.com/random/?shadows") no-repeat', 
                backgroundSize:'cover'
            }}
        >
            <h2 className="mx-2">News Feed</h2>
            {messages.map( (message) => (
                <div className="message p-lg-0 my-4" id={message.id} key={message.id}>
                    <div className="col-lg-12 px-lg-5 py-lg-3 p-3" >              
                        <img 
                            width="50" height="50" className="m-2" 
                            style={{borderRadius:'50%'}}
                            src={message.userImg} alt="new"
                        />
                        {message.first} {message.last} 


                        { currentUser.email !== message.email ? '' :
                            <a href
                                className="msgMenu float-end"
                                id={message.id} 
                                onClick={ (e) => {
                                    msgMenuClicked(e);
                                }}
                            >    
                                <img 
                                    height="20" className="mx-2 float-end" 
                                    src="./assets/Icon-dots-black.png" alt='new'
                                />
                                <div id={message.id} className={ showMenu ? 'hide': 'show'}>
                                </div>
                            </a>
                        }
                        <br></br>
                        {message.message}<br></br><br></br>


                        { currentUser.email !== message.email ? '' :
                            showMenuID !== message.id ? '' :
                                showMenu ? '' :
                                    <div>
                                        <input 
                                            style={{margin:'0px 0px 10px 0px'}}
                                            value={formData.message} 
                                            onChange={ function(event){ 
                                                setFormData({...formData, message: event.target.value}) 
                                            } }    
                                            type="textarea" placeholder="Update your message"
                                        />
                                            <button 
                                                onClick={ () => { editMessage(message.id) } } 
                                                style={{color:'#222f '}}
                                                className="app-btn">Update
                                            </button>
                                            <button 
                                                style={{color:'#ffff', background:'#f00f'}}
                                                onClick={ () => { deleteMessage(message.id) } } 
                                                className="btn-black">Delete
                                            </button>
                                    </div>
                        }

                
                        <strong>{message.email}</strong><br></br>
                        <hr></hr>
                        <div className="icons row justify-content-lg-left align-items-start">
                            <div className="col-4 text-left">
                                <a href
                                    id={message.id} 
                                        onClick={ (e) => {
                                            updateMessage(message.id);
                                            // setLikes( !likes );
                                            // setLikeID(e);
                                            console.log("likeID =>", e.currentTarget.id);
                                        }} 
                                >
                                    { message.likes ? 
                                        <img height="20px" className="mx-1" src="./assets/Icon-thumb-lightblue.png" alt='new'/> 
                                        :
                                        <img height="20px" className="mx-1" src="./assets/Icon-thumb-black.png" alt='new'/>
                                    } {message.likes}
                                </a>
                            </div>
                            <div className="col-4 text-left">
                                <a href>
                                    <img height="20px" className="mx-1" src="./assets/Icon-share-black.png" alt='new'/>Share
                                </a>
                            </div>
                            <div className="col-4 text-left">
                                <a href>
                                    <img height="20px" className="mx-1" src="./assets/Icon-comment-black.png" alt='new'/>Comment
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            ))} 
            <div className="create text-left my-5">        
                <form id='form'>
                    <h3 className="mx-1">Message</h3>
                    <input 
                        value={formData.message} 
                        onChange={ (event) => { 
                            setFormData({...formData, message: event.target.value}) 
                            event.target.value ? setError(false) : setError(true)
                        } }    
                        type="textarea" placeholder="Type your message here"
                    /><br></br>
                    <input 
                        onClick={createMessage}
                        className="btn-blue" type="submit" value="Send"
                    /><br></br>
                        { error ? <p className="text-danger mx-2"> Please enter a message</p> : '' }
                </form>
            </div>
        </div>
    )
}



