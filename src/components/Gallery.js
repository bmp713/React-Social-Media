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

export default function Gallery(){

    // User authentication
    const auth = getAuth();
    const [user] = useAuthState(auth);
    const [error, setError] = useState(false);

    const navigate = useNavigate();
    const [images, setImages] = useState([]);
    let data = '';
    let image_bg;

    const [formData, setFormData] = useState({
        id:"",
        name: "",
        email: "",
        // password: ""
    });

    useEffect(() => {
        //console.log(`user => ${auth.currentUser.email} `);
        readGallery();
    },[]);

    const readGallery = async () => {
        data = await getDocs( collection(db, 'gallery') );

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

        if( !formData.name ){
            setError(true);
            return;
        }
        else setError(false);

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
        
        // Unsplash collection IDs
        // https://unsplash.com/collections/
        // https://unsplash.com/collections/895539/faces,277630, 1041983
        // https://unsplash.com/collections/302501/people-%26-portraits
        // https://source.unsplash.com/collection/collectionID/imageWidth%7DximageHeight/?sig=randomNumber`
        //
        // let url = 'https://source.unsplash.com/collection/collectionID/400x600/?sig=imageID';

        let random = Math.floor(Math.random() * 100000);
        let urlImg = 'https://source.unsplash.com/random/?california';
        image_bg = urlImg;

        // Update friend document
        await setDoc( doc(db, 'gallery', docRef.id.toString()), {
            id: docRef.id,
            name: formData.name,
            email: formData.email,
            imageURL: formData.image? formData.image : urlImg
        })

        readGallery();
    };

    return(
        <div className='gallery'>
            <div className="row justify-content-lg-center align-items-start p-5">
                <div className="col-lg-12 text-left">
                    <h2>Gallery</h2>  
                </div>
                {images.map( (user) => (
                    <div className="col-lg-6" id={user.id} key={user.id}>
                        <img className="my-2" width="100%" src={user.imageURL} alt="new"/>
                        <p>
                            {user.name} <br></br>
                        </p>
                        <span><button 
                            onClick={ () => { deleteImage(user.id) } } 
                            className="App-btn">Delete
                        </button></span>
                        <hr></hr>
                    </div>
                ))}                
                <div className="col-lg-12 text-left">
                    <div className="create text-left">   
   
                        <form id='form' onSubmit={createImage}>
                            <div className="row text-left m-2">
                                <h4>Add Image</h4>  
                            </div>  
                            <input 
                                value={formData.name} 
                                onChange={ function(e){ setFormData({...formData, name: e.target.value}) } }    
                                type="text" placeholder="Label"
                            /><br></br>
                            <input 
                                value={formData.image} 
                                onChange={ function(e){ setFormData({...formData, image: e.target.value}) } }    
                                type="text" placeholder="Image URL"
                            />
                            <p className="mx-2" style={{fontSize:"10px"}}>(Random image will be generated otherwise)</p>
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



