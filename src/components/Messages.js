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
        console.log("readMessages");
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
        <div 
            className="messages col-lg-12 text-left p-lg-5 p-4 my-2" 
            style={{
                // 302501,895539,277630,1041983,546927
                // background:'linear-gradient(#000a,#000a), url("https://source.unsplash.com/random/?shadows") no-repeat', 
                background:'linear-gradient(#0066ccaa,#000a), url("https://source.unsplash.com/random/?shadows") no-repeat', 
                // background:'linear-gradient(#0077cc77,#000a), url("https://source.unsplash.com/random/167880") no-repeat', 
                backgroundSize:'cover'
            }}
        >
            <h2 className="mx-2">Messages</h2>  
            {messages.map( (user) => (
                <div className="p-3" id={user.id} key={user.id}>
                    {/* <img className="my-2" height="250" src="https://source.unsplash.com/random/?city" alt="new"/> */}
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
                                className="app-btn">Edit
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
            <div className="create text-left">        
                <form id='form' >
                    <h3 className="mx-3">Post</h3>
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



