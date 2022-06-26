/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import '../App.scss';
import React, { useState, useEffect, useContext } from 'react';
import { doc, addDoc, setDoc, getDocs, deleteDoc, collection } from 'firebase/firestore';
import { db } from '../Firebase';
import { storage } from '../Firebase';
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";

import {UserContext} from '../contexts/UserContext';

export default function Gallery(){

    // User authentication
    const { currentUser, login, logout } = useContext(UserContext);

    const [images, setImages] = useState([]);
    const [error, setError] = useState(false);

    const [formData, setFormData] = useState({
        id:"",
        name: "",
        search: "",
    });

    const [showMenu, setShowMenu] = useState(false);
    //const [showMenuID, setShowMenuID] = useState(false);

    const [showURL, setShowURL] = useState(false);
    const [showURL_ID, setShowURL_ID] = useState(null);
    

    //const fileRef = useRef(null);
    const [file, setFile] = useState("");
    const [imageURL, setImageUrl] = useState(null);

    useEffect(() => {
        readGallery();
    },[]);

    const readGallery = async () => {
        let data = await getDocs( collection(db, 'gallery') );

        // Copy all data to messages state array
        setImages( data.docs.map( (doc) => ({
            ...doc.data()
        }) ) );
        
        images.forEach( (image) => {
            console.log(image);
        });
    };
    
    const deleteImage = async (id) => {
        console.log('deleteDoc(id) => ' + id);
        try{
            await deleteDoc( doc(db, 'gallery', id) );
            readGallery();
        }catch(error){
            console.log(error);
        }
    };

    const createImage = async (e) => {
        e.preventDefault();

        // if( !formData.name ){
        //     setError(true);
        //     return;
        // }
        // else setError(false);

        let docRef;
        try{
            docRef = await addDoc( collection(db, 'gallery'), {});
            console.log('id => '+ docRef.id);
        }catch(error){
            console.log(error);
        }

        // Generate random headshot image with fetch API
        await fetch('https://source.unsplash.com/collection/928423/480x640', {
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
        
        // https://unsplash.com/collections/302501,895539,277630,1041983,546927
        // https://source.unsplash.com/collection/{collectionID}/{imageWidth}x{imageHeight}/?sig=randomNumber
        // https://source.unsplash.com/collection/collectionID/400x600/?sig=imageID

        let random = Math.floor(Math.random() * 100000);
        let urlImg;

        formData.search ? 
            urlImg = 'https://source.unsplash.com/random/?' + formData.search : 
            urlImg = 'https://source.unsplash.com/random/546927'
        ;

        // Update friend document
        await setDoc( doc(db, 'gallery', docRef.id.toString() ), {
            id: docRef.id,
            userId: currentUser.id,
            name: formData.name,
            search: formData.search,
            imageURL: formData.image? formData.image : urlImg
        })
        readGallery();
        setImageUrl('');

    
    };
    // Upload file to Firebase
    const uploadFile = (e) => {
        e.preventDefault();

        const file = e.target.files[0];

        console.log("event =>", e);
        console.log("file =>", file);

        const storageRef = ref(storage, 'files/'+ file.name );

        uploadBytes(storageRef, file )
            .then( (snapshot) => {
                console.log('Uploaded file'); 
                console.log('snapshot =>', snapshot);

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
        <div className='gallery my-5 p-5'>
            <div className="row justify-content-lg-between align-items-start">
                <div className="col-lg-12 text-left">
                    <h2>Gallery
                        <span><button className="float-end text-decoration-underline text-dark">
                            See all photos
                        </button></span> 
                    </h2>  
                </div>
                {images.map( (image) => (
                    (currentUser.id !== image.userId) ? '' : (
                        <div
                            style={{color:'#ffff', background:'#000d', borderRadius:'4px'}} 
                            className="col-lg-5 my-lg-2 py-2 my-3" id={image.id} key={image.id}
                        >
                            <img 
                                width="30"
                                height="30" 
                                className="m-2" 
                                src={currentUser.imgURL} 
                                style={{borderRadius:'50%'}}
                                alt="new"
                            />
                            {currentUser.first} {currentUser.last}
                            <a 
                                className="float-end" href
                                onClick={ (e) => {
                                    console.log("Menu clicked =>", image.id);
                                    setShowMenu( !showMenu );
                                }}
                            >
                            <img height="20" className="mx-2 float-end" src="./assets/Icon-dots-white.png" alt='new'/>
                            </a>
                            <img 
                                width="100%"
                                className="my-2 img-responsive" 
                                src={image.imageURL} alt="new"
                            />


                            { showMenu ? '' :
                                    <div className="icons row justify-content-lg-left align-items-start">
                                        <div className="col-3 text-left">    
                                            <a href><img height="15" className="mx-1" 
                                                src="./assets/Icon-star-white.png" alt='new'/></a>
                                        </div>
                                        <div className="col-3 text-left">
                                            <a id={image.id} href onClick={ (e)=>{ 
                                                    if( image.id === e.currentTarget.id ){
                                                        setShowURL( !showURL);
                                                        setShowURL_ID( e.currentTarget.id );
                                                    }
                                                    console.log("image.id => ",image.id);
                                                    console.log("e.currentTarget.id => ", e.currentTarget.id);
                                                }} >
                                                <img height="15" className="mx-1" src="./assets/Icon-share-white.png" alt='new'/>
                                            </a>
                                        </div>
                                        <div className="col-3 text-left">
                                            <a href={image.imageURL} download target="_blank"><img height="15" className="mx-1" 
                                                src="./assets/Icon-download-white.png" alt='new'/></a>
                                        </div>
                                        <div className="col-3 text-left">
                                            <button 
                                                onClick={ () => { deleteImage(image.id) } } 
                                                className="">
                                                    <a href><img height="15" className="mx-1" src="./assets/Icon-trash-white.png" alt='new'/></a>
                                            </button>
                                        </div>
                                    </div> 
                            }


                            { !showURL ? '' :
                                image.id !== showURL_ID ? '' :
                                    <p style={{ fontSize:'10px', wordWrap: 'break-word'}}>{image.imageURL}</p>
                            }
                            <hr></hr>
                        </div>
                    )
                ))}      
                <br></br>   
                <hr></hr>      
                <div className="col-lg-12 text-left">
                    <div className="create text-left">   
                        <form id='form' onSubmit={createImage}>
                            <div className="row text-left my-2">
                                <h4>Add Image</h4>  
                            </div>
                            <input 
                                value={formData.search} 
                                onChange={ function(e){ setFormData({...formData, search: e.target.value}) } }    
                                type="text" placeholder="Search by category"
                            />
                            <input 
                                value={formData.image} 
                                onChange={ function(e){ setFormData({...formData, image: e.target.value}) } }    
                                type="text" placeholder="Image URL"
                            />
                            <br></br>
                            <input 
                                onChange={ (e) => { 
                                    setFile( e.target.files[0] );
                                    console.log("file =>", file);
                                    uploadFile(e);
                                }}    
                                type="file"
                            /><br></br>
                            {(!file) ? '' : (
                                <div className="col-lg-12 text-left p-2">
                                    <img 
                                        onClick={ () => { setFile(null); setImageUrl(null); }}
                                        width="50%" src={imageURL} alt=""></img>
                                    <br></br>
                                    {imageURL}                            
                                </div>
                            )}
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



