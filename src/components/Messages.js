/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import '../App.scss';
import React, { useRef, useState, useEffect, useContext } from 'react';
import { doc, where, query, addDoc, setDoc, getDoc, getDocs, deleteDoc, collection, serverTimestamp } from 'firebase/firestore';
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
    const [showMenu, setShowMenu] = useState(false);

    const [formData, setFormData] = useState({
        message: '',
        imageURL: ''
    });

    // const fileRef = useRef(null);
    const [file, setFile] = useState("");
    const [imageURL, setImageUrl] = useState(null);
    const [imageURLEdit, setImageUrlEdit] = useState(null);
    const [msgUser, setMsgUser] = useState(null);

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
        
        data.forEach( (message) => {
            console.log("readMessages() message.data().userID =>",  message.data().userID );
            //console.log("IMAGE URL readUser =>", readUser( message.data().userID ) );
        });

        console.log("data =>", data.docs);
        console.log("messages =>", messages);
    };
    
    //Read message from Firebase
    const readMessage = async (id) => {

        let data = await doc( collection(db, 'messages', id) );
        console.log("readMessage() data =>", data);
    };

    // Read message author info
    const readUser = async (id) => {

            let data;
            let userImgURL;
            try{
                let docs = query( collection(db, "users"), where("id", "==", id) );
                data = await getDocs(docs);
                data.forEach( (doc) => {
                    console.log( "IMAGE readUser(id) =>", doc.data() );
                    userImgURL = doc.data().imgURL;
                });
                
                return userImgURL;
            }catch(error){
                console.log("readUser(error) => " + error );
            }
        };  

    const createMessage = async (e) => {

        e.preventDefault();
        console.log("createMessage");
 
        // Add new message to database
        let docRef;
        try{
            docRef = await addDoc( collection(db, 'messages'), {});
            console.log('id => '+ docRef.id);
            readMessages();
        }catch(error){
            console.log(error);
        }
        try{
            await setDoc( doc(db, 'messages', docRef.id.toString()), {
                id: docRef.id,
                email: currentUser.email,
                first: currentUser.first,
                last: currentUser.last,
                message: formData.message,
                userImg: currentUser.imgURL,
                userID: currentUser.id,
                imageURL: imageURL,
                likes: 0
            })
            readMessages();

        }catch(error){
            console.log(error);
        }
    };  

    // Delete message by message ID
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

    // Edit message by message ID
    const editMessage = async (id) => {
        setShowMenu( !showMenu );
        
        let data = await doc( db, 'messages', id );
        const docSnap = await getDoc(data);

        try{
            await setDoc( doc(db, 'messages', id ), {
                id: docSnap.data().id,
                email: docSnap.data().email,
                first: docSnap.data().first,
                last: docSnap.data().last,
                message: formData.message,
                userImg: docSnap.data().userImg,
                userID: docSnap.data().userID,
                imageURL: imageURL, 
                likes: docSnap.data().likes
            })
            readMessages();
        }catch(error){
            console.log(error);
        }
    };

    // Update likes by message id
    const updateLikes = async (id) => {
        console.log('updateMessage(id) likes =>', id);

        try{
            let data = await doc( db, 'messages', id );
            const docSnap = await getDoc(data);

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
                    userID: docSnap.data().userID,
                    imageURL: docSnap.data().imageURL,
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

    // Upload new image to message
    const uploadFile = (e) => {
        e.preventDefault();

        const file = e.target.files[0];
        console.log("file =>", file);
        console.log("event =>", e);

        const storageRef = ref(storage, 'files/'+ file.name );

        uploadBytes(storageRef, file )
            .then( (snapshot) => {
                console.log('Uploaded file'); 
                console.log('snapshot =>', snapshot);
                setError(false);

                getDownloadURL(snapshot.ref).then( (url) => {
                    console.log('File URL =>', url);
                    setImageUrl(url);
                    setFormData({...formData, image: url})
                });
                setImageUrl('');
            })
            .catch( (error) => {
                console.log("File error =>", error);
            })
    }

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
                // background:'linear-gradient(#2266ccaa,#000a), url("https://source.unsplash.com/random/?shadows") no-repeat', 
                // background:'linear-gradient(#2266ccaa,#0000), url("./assets/10567.png")', 
                background:'linear-gradient(#2266ccaa,#2266ccaa)', 
                backgroundSize:'cover'
            }}
        >
            <h2 className="mx-2">News Feed</h2>
            {messages.map( (message) => (
                <div className="message p-lg-0 my-2" id={message.id} key={message.id}>
                    <div className="col-lg-12 px-lg-5 py-lg-3 p-3" >              
                        <img 
                            width="50" height="50" className="m-2" 
                            style={{borderRadius:'50%'}}
                            src={message.userImg} alt="new"
                        />
                        {message.first} {message.last} 


                        { currentUser.email === message.email && 
                            <a href
                                className="msgMenu float-end"
                                id={message.id} 
                                onClick={ (e) => { msgMenuClicked(e); }}
                            >    
                                <img 
                                    height="20" className="mx-2 float-end" 
                                    src="./assets/Icon-dots-black.png" alt='new'
                                />
                                { showMenu && <div id={message.id}></div> }
                            </a>
                        }
                        <br></br>


                        { message.imageURL &&
                            <img width="100%" className='my-3' src={message.imageURL} alt=''/>
                        }
                        {message.message}<br></br><br></br>


                        { currentUser.email === message.email &&
                            showMenuID === message.id &&
                                showMenu &&
                                    <div>
                                        <input 
                                            style={{margin:'0px 0px 10px 0px'}}
                                            value={formData.message} 
                                            onChange={ function(event){ 
                                                setFormData({...formData, message: event.target.value}) 
                                            } }    
                                            type="textarea" placeholder="Update your message"
                                        />
                                        <input 
                                            className="hide"
                                            style={{margin:'0px'}}
                                            value={formData.imageURR} 
                                            onChange={ function(event){ 
                                                setFormData({...formData, imageURL: event.target.value}) 
                                            } }    
                                            type="textarea" placeholder="Image URL"
                                        />
                                        <input 
                                            style={{margin:'0px', border:'none'}}
                                            onChange={ (e) => { 
                                                setFile( e.target.files[0] );
                                                uploadFile(e);
                                            }}    
                                            type="file"
                                        /><br></br>
                                        {file &&
                                            <div 
                                                className="col-lg-12 text-left p-2">
                                                <img 
                                                    onClick={ () => {
                                                        setFile(null); setImageUrl('');
                                                    }}
                                                    width="25%" src={imageURL} alt=""></img>
                                                <br></br>
                                                <p style={{ fontSize:'10px', wordWrap: 'break-word'}}>{imageURL}</p>                         
                                            </div>
                                        } 
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


                        <hr></hr>
                        <div className="icons row justify-content-lg-left align-items-start">
                            <div className="col-4 text-left">
                                <a href
                                    id={message.id} 
                                        onClick={ (e) => {
                                            updateLikes(message.id);
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
                    />
                    <input 
                        className="hide"
                        value={imageURL} 
                        onChange={ (event) => { 
                            setFormData({...formData, imageURL: event.target.value}) 
                            event.target.value ? setError(false) : setError(true)
                        } }    
                        type="textarea" placeholder="Image URL"
                    /><br></br>
                    <input 
                        onChange={ (e) => { 
                            setFile( e.target.files[0] );
                            uploadFile(e);
                        }}    
                        type="file"
                    /><br></br>
                    {file &&
                        <div className="col-lg-12 text-left p-2">
                            <img 
                                onClick={ () => { setFile(null); setImageUrl(null); }}
                                width="50%" src={imageURL} alt=""></img>
                            <br></br>
                            {imageURL}                            
                        </div>
                    }
                    <input 
                        onClick={createMessage}
                        className="submit-btn" type="submit" value="Send"
                    /><br></br>
                        { error ? <p className="text-danger mx-2"> Please enter a message</p> : '' }
                </form>
            </div>
        </div>
    )
}



