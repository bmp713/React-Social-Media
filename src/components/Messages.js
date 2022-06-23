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
    
    const [showMenu, setShowMenu] = useState(true);
    const [msgEdit, setMsgEdit] = useState(false);


    const [formData, setFormData] = useState({});


    //const fileRef = useRef(null);
    const [file, setFile] = useState("");
    const [imageURL, setImageUrl] = useState(null);



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
            userImg: currentUser.imgURL
        })
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

            // let newData = docSnap.data();
            // await setDoc( doc(db, 'messages', id ), ()=>{
                
            // })
            readMessages();
        }catch(error){
            console.log(error);
        }
    };

    const msgMenuClicked = (id) => {
        setShowMenu( !showMenu );
    }

    return(
        <div 
            className="messages row text-left align-items-center p-lg-5 p-4 my-2" 
            style={{
                background:'linear-gradient(#0066ccaa,#000a), url("https://source.unsplash.com/random/?shadows") no-repeat', 
                backgroundSize:'cover'
            }}
        >
            <h2 className="mx-2">Messages</h2>
            {messages.map( (user) => (
                <div className="message p-lg-0 my-4" id={user.id} key={user.id}>
                    <div className="col-lg-12 px-lg-5 py-lg-3 p-3" >              
                        <img 
                            width="50" height="50" className="m-2" 
                            style={{borderRadius:'50%'}}
                            src={user.userImg} alt="new"
                        />
                        {user.first} {user.last} 

                        { (currentUser.email !== user.email) ? '' :
                            <a className="msgMenu float-end" href>
                                <img 
                                    height="20" 
                                    className="mx-2 float-end" 
                                    src="./assets/Icon-dots-black.png" alt='new'
                                    onClick={msgMenuClicked}
                                />
                                <div id={user.id} className={ showMenu ? 'hide': 'show'}>
                                    {/* <button 
                                        style={{color:'#000f', background:'#ffff', padding:'4px 35px', border:'1px solid #000f'}}
                                        onClick={ () => { setMsgEdit(true); editMessage(user.id);} }>Edit
                                    </button>
                                    <button 
                                        style={{color:'#ffff', background:'#000f', padding:'5px 30px'}}
                                        onClick={ () => { deleteMessage(user.id) } }>Delete 
                                    </button> */}
                                </div>
                            </a>
                        }
                        <br></br>
                        {user.message}<br></br><br></br>
                        { (currentUser.email !== user.email) ? '' :
                         !showMenu ? 
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
                                        onClick={ () => { editMessage(user.id) } } 
                                        style={{color:'#222f '}}
                                        className="app-btn">Update
                                    </button>
                                    <button 
                                        style={{color:'#ffff', background:'#f00f'}}
                                        onClick={ () => { deleteMessage(user.id) } } 
                                        className="btn-black">Delete
                                    </button>
                            </div> : ''
                        }
                        <strong>{user.email}</strong><br></br>
                        <hr></hr>
                        <div className="icons row justify-content-lg-left align-items-start">
                            <div className="col-4 text-left">
                                <a 
                                    onClick={ () => updateMessage(user.id)}
                                    href
                                >
                                    <img 
                                        height="20px" 
                                        className="mx-1" 
                                        src="./assets/Icon-thumb-black.png" alt='new'
                                    />
                                    Like
                                </a>
                            </div>
                            <div className="col-4 text-left">
                                <a href><img 
                                    height="20px" 
                                    className="mx-1" 
                                    src="./assets/Icon-share-black.png" alt='new'/>
                                    Share
                                </a>
                            </div>
                            <div className="col-4 text-left">
                                <a href><img 
                                    height="20px" 
                                    className="mx-1" 
                                    src="./assets/Icon-comment-black.png" alt='new'/>
                                    Comment
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
            {/* <div className="create text-left my-5">        
                <h3 className="mx-1">Image</h3>
                <input 
                    onChange={ (e) => { 
                        setFile( e.target.files[0] );
                        console.log("file =>", file);
                        uploadFile(e);
                    }}    
                    type="file"
                /><br></br>
                <input 
                    onClick={createMessage}
                    className="btn-blue" type="submit" value="Send"
                /><br></br>
                <img height="200" src={imageURL} alt=""></img>
            </div> */}
        </div>
    )
}



