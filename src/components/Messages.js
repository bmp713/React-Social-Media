/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import '../App.scss';
import React, { useState, useEffect, useContext } from 'react';
import { doc, addDoc, setDoc, getDocs, deleteDoc, collection } from 'firebase/firestore';
import { db } from '../Firebase';

import {UserContext} from '../contexts/UserContext';

export default function Messages(){

    // User authentication
    const { currentUser, login, logout } = useContext(UserContext);

    const [messagesCount, setMessagesCount] = useState(0);
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState(false);
    
    const [formData, setFormData] = useState({
        id:"",
        name: "",
        email: "",
    });

    useEffect(() => {
        readMessages();
    },[]);

    //Read messages from Firebase
    const readMessages = async () => {
        // console.log("readMessages");
        let data = await getDocs( collection(db, 'messages') );
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
                email: currentUser.name,
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

    return(
        <div 
            className="messages col-lg-12 text-left p-lg-5 p-4 my-2" 
            style={{
                // 302501,895539,277630,1041983,546927
                background:'linear-gradient(#0066ccaa,#000a), url("https://source.unsplash.com/random/?shadows") no-repeat', 
                // background:'linear-gradient(#0077cc77,#000a), url("https://source.unsplash.com/random/167880") no-repeat', 
                backgroundSize:'cover'
            }}
        >
            <h2 className="mx-2">Messages</h2>  
            {messages.map( (user) => (
                <div className="p-lg-3" id={user.id} key={user.id}>
      
                    <p 
                        className="p-lg-5 p-3 my-lg-3" 
                        style={{color:'#222f', background:'#ffff', borderRadius:'5px', boxShadow:'20px 20px 20px #0007'}}
                        // style={{background:'#0079c299', borderRadius:'5px', boxShadow:'20px 20px 20px #0007'}}
                    >              
                        <img 
                            width="50" height="50" className="m-2" 
                            style={{borderRadius:'50%'}}
                            src={user.userImg} 
                            alt="new"
                        />
                        {user.first} {user.last}
                        <a 
                            className="float-end" href><img height="20" className="mx-2 float-end" 
                            src="./assets/Icon-dots-black.png" alt='new'/>
                        </a>
                            <hr></hr>
                        {user.message}<br></br><br></br>
                        <strong>{user.email}</strong><br></br>
                        <span>
                        { (currentUser.name !== user.email) ? '' :
                            <div>
                                <button 
                                    onClick={ () => { editMessage(user.id) } } 
                                    style={{color:'#222f !important'}}
                                    className="app-btn">Edit
                                </button>
                                <button 
                                    onClick={ () => { deleteMessage(user.id) } } 
                                    className="btn-black">Delete
                                </button>
                                {/* <p style={{fontSize:'12px'}}>Enter new message in form and click Edit</p> */}

                            </div>
                        }
                        </span>
                        <hr></hr>
                        <div className="icons row justify-content-lg-left align-items-start">
                            <div className="col-4 text-left">
                                <a href ><img height="20px" className="mx-1" src="./assets/Icon-thumb-black.png" alt='new'/>Like</a>
                            </div>
                            <div className="col-4 text-left">
                                <a href><img height="20px" className="mx-1" src="./assets/Icon-share-black.png" alt='new'/>Share</a>
                            </div>
                            <div className="col-4 text-left">
                                <a href><img height="20px" className="mx-1" src="./assets/Icon-comment-black.png" alt='new'/>Comment</a>
                            </div>
                        </div>
                    </p>

                </div>
            ))} 
            <div className="create text-left my-5">        
                <form id='form'>
                    <h3 className="mx-1">Post</h3>
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
                        // style={{border:'2px solid #ffff'}}
                        className="submit-btn" type="submit" value="Send"/><br></br>
                        { error ? <p className="text-danger mx-2"> Please enter a message</p> : '' }
                </form>
                <br></br>
            </div>
        </div>
    )
}



