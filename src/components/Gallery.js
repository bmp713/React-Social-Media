/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import '../App.scss';
import React, { useState, useEffect, useContext } from 'react';
import { doc, addDoc, setDoc, getDocs, deleteDoc, collection } from 'firebase/firestore';
import { db } from '../Firebase';

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

        // Create new user
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
    };

    return(
        <div className='gallery my-5 p-5'>
            <div className="row justify-content-lg-between align-items-start">
                <div className="col-lg-12 text-left">
                    <h2>Gallery</h2>  
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
                            {currentUser.first} 
                            <a 
                                className="float-end" href><img height="20" className="mx-2 float-end" 
                                src="./assets/Icon-dots-white.png" alt='new'/></a>
                            <img 
                                width="100%"
                                className="my-2 img-responsive" 
                                src={image.imageURL} alt="new"
                            />
                            <div className="icons row justify-content-lg-left align-items-start">
                                <div className="col-3 text-left">    
                                    <a href><img height="20" className="mx-2" 
                                        src="./assets/Icon-star-white.png" alt='new'/></a>
                                </div>
                                <div className="col-3 text-left">
                                    <a href><img height="20" className="mx-2" 
                                        src="./assets/Icon-share-white.png" alt='new'/></a>
                                </div>
                                <div className="col-3 text-left">
                                    <a href><img height="20" className="mx-2" 
                                        src="./assets/Icon-download-white.png" alt='new'/></a>
                                </div>
                                <div className="col-3 text-left">
                                    <button 
                                        onClick={ () => { deleteImage(image.id) } } 
                                        className="">
                                            <a href><img height="20" className="mx-2" src="./assets/Icon-trash-white.png" alt='new'/></a>
                                    </button>
                                </div>
                            </div> 
                            <p style={{wordWrap:'break-word', fontSize:'12px'}}>
                                {/* {image.search}<br></br> */}
                            </p>
                            <hr></hr>
                        </div>
                    )
                ))}                
                <div className="col-lg-12 text-left">
                    <div className="create text-left">   
                        <form id='form' onSubmit={createImage}>
                            <div className="row text-left my-2">
                                <h4>Add Image</h4>  
                            </div>
                            <input 
                                value={formData.search} 
                                onChange={ function(e){ setFormData({...formData, search: e.target.value}) } }    
                                type="text" placeholder="Search"
                            />
                            <input 
                                value={formData.image} 
                                onChange={ function(e){ setFormData({...formData, image: e.target.value}) } }    
                                type="text" placeholder="Image URL"
                            />
                            <p className="mx-2" style={{fontSize:"12px"}}>
                                (Random image will be generated if all fields left blank)
                            </p>
                            <br></br>
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



