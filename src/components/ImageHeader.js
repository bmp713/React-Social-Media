/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import '../App.scss';
import React, { useState, useEffect, useContext } from 'react';
import { doc, query, where, addDoc, setDoc, getDoc, getDocs, deleteDoc, collection } from 'firebase/firestore';
import { db } from '../Firebase';
import { storage } from '../Firebase';
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";

import {UserContext} from '../contexts/UserContext';

export default function ImageHeader(){

    // User authentication
    const { currentUser, login, logout } = useContext(UserContext);

    const [error, setError] = useState(false);
    const [formData, setFormData] = useState({});
    const [formMsg, setFormMsg] = useState()

    const [docID, setDocID] = useState(null);

    // const fileRef = useRef(null);
    const [file, setFile] = useState("");
    const [imageURL, setImageUrl] = useState(null);

    useEffect(() => {
    },[] );

    // Create user additional profile data in users db
    const updateUserImage= async (e) => {
        e.preventDefault();

        if( formData.image == null ){
            console.log("No Image");
            setError(true);
            return;
        };

        console.log("IMAGE URL =>", imageURL);
        console.log("IMAGE currentUser.id =>", currentUser.id);

        try{
            let docs = query( collection(db, "users"), where("id", "==", currentUser.id) );
            let data = await getDocs(docs);

            data.forEach( (doc) => {
                console.log( "IMAGE doc.data() =>", doc.data() );    
            });

            try{
                await setDoc( doc(db, 'users', currentUser.id ), {
                    ...currentUser,
                    imgURL: imageURL
                })
                setError(false);
                setFormMsg("New profile image is updated");
            }catch(error){
                console.log(error);
            }
        }catch(error){
            console.log("readProfile(error) => " + error );
        }
    };  

    // Upload new profile image to Firebase
    const uploadFile = (e) => {
        e.preventDefault();
        setFormMsg(false);

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
            })
            .catch( (error) => {
                console.log("File error =>", error);
            })
    }

    return(
        <div className=''>
            <div className="row justify-content-lg-center align-items-center">
                
                <form  id='form' onSubmit={updateUserImage}>
                    <div className="col-lg-6 text-left">
                        <input 
                            style={{color:'#ffff',background: '#0000'}}
                            onChange={ (e) => { 
                                setFile( e.target.files[0] );
                                uploadFile(e);
                            }}    
                            type="file"
                        />
                    </div>
                    <div className="col-lg-6 text-left">
                        {file &&
                            <div className="col-lg-12 text-left p-2">
                                <img 
                                    onClick={ () => { setFile(null); setImageUrl(null); }}
                                    width="50%" src={imageURL} alt=""></img>
                                <br></br>
                                {imageURL}                            
                            </div>
                        }
                        <input className="app-btn" type="submit" value="Profile Image"/><br></br>
                        { formMsg ? <p className="text-success mx-2">Profile image has been updated</p> : '' }
                        { error ? <p className="text-danger mx-2"> Please upload an image</p> : '' }
                    </div>
                </form>
            </div>
        </div>  
    )
}



