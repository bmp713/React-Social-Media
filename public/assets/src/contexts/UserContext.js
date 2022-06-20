/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { React, useEffect, useState, useContext, createContext} from 'react';
import { query, where, doc, addDoc, setDoc, getDoc, getDocs, deleteDoc, collection } from 'firebase/firestore';
import { signOut, onAuthStateChanged, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

import { auth } from '../Firebase';
import { db } from '../Firebase';

export const UserContext = createContext();

export const UserProvider = ( {children} ) => {

    const [currentUser, setCurrentUser] = useState('');
    const [currentUserID, setCurrentUserID] = useState('id');
    
    console.log("UserContext localStorage => ", window.localStorage.getItem('currentUserID' ) );

    useEffect( () => {
        readprofile( JSON.parse(window.localStorage.getItem('currentUserID')) );
        setCurrentUserID( JSON.parse(window.localStorage.getItem('currentUserID')) );
        console.log("UserContext => currentUserID =>", currentUserID );

        console.log("random =>", Math.floor(Math.random() * 14) );

    },[]);

    // Login updates the user data with a name parameter    
    const login = (name, password) => {
        return signInWithEmailAndPassword(auth, name, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log( name, 'signed in' );
                readprofile( auth.currentUser.uid );
                setCurrentUserID(auth.currentUser.uid);

                window.localStorage.setItem('currentUserID', JSON.stringify(currentUserID))
                console.log("UserContext localStorage => ", window.localStorage.getItem('currentUserID' ) );
            })
    };

    // Read additional profile data from users db by id
    const readprofile = async (id) => {
        let data;
        try{
            let docs = query( collection(db, "users"), where("id", "==", id) );
            data = await getDocs(docs);
            data.forEach( (doc) => {
                console.log( "readProfile(id) =>", doc.data() );

                setCurrentUser((currentUser) => ({
                    id: doc.data().id,
                    name: doc.data().email,
                    first: doc.data().first,
                    last: doc.data().last,
                    imgURL: doc.data().imgURL,
                    friends: doc.data().friends
                }));
                console.log("readProfile =>", currentUser);
            });
        }catch(error){
            console.log("readProfile(error) => " + error );
        }
    };  

    // Sign up new user in firebase, send email, and login 
    const signup = (first, last, email, password ) => {
        return createUserWithEmailAndPassword(auth, email, password).then(() =>{
            createUserFirebase(auth.currentUser.uid, first, last, email);
            sendEmailVerification(auth.currentUser);
            login(email, password);
        });
    }

    // Create user additional profile data in users db
    const createUserFirebase = async ( id, first, last, email ) => {

        // Create new user in Firebase db
        try{
            let random = Math.floor(Math.random() * 14);
            let imgURL ="./assets/Headshot-" + random + ".jpg";
            console.log("imgUrl", imgURL);
            let doc = await addDoc( collection(db, 'users'), {
                id: id,
                first: first,
                last: last,
                email: email,
                imgURL: imgURL,
                // imgURL: 'https://source.unsplash.com/collection/895539/400x400',
                friends: ''
            });
            console.log('addDoc id => '+ id);
        }catch(error){
            console.log('createUserFirebase() => ', error);
        }
    };  

       // Create user additional profile data in users db
    const updateUserFirebase = async ( currentUser ) => {
        try{
            await setDoc( doc( db, "users", currentUser.id), {
                id: currentUser.id,
                name: currentUser.name,
                first: currentUser.first,
                last: currentUser.last,
                imgURL: currentUser.imgURL,
                friends: currentUser.friends
            });
            console.log("updateUserFirebase => " + currentUser );
        }catch(error){
            console.log("updateUserFirebase => " + error );
        }
    };  

    // Send passwored reset email
    const reset = (email) => {
        return sendPasswordResetEmail(auth, email)
    };

    // Logout resets currentUser to empty
    const logout = () => {
        setCurrentUser( (currentUser) => ({
            id: '',
            name: '',
            first: '',
            last: '',
            imgURL: '',
            friends: ''
        }));

        window.localStorage.setItem('currentUserID', '')
        console.log("UserContext localStorage => ", window.localStorage.getItem('currentUserID' ) );

        console.log( "logout currentUser => ",currentUser );
        signOut( auth )
            .then( () => {
                console.log( currentUser.name, 'signed out' );
            }).catch((error) => {
                console.log("logout()", error);
            });
    };

    // Wrapper for Context Provider
    return (
        <UserContext.Provider value={ {currentUser, login, logout, signup, reset, setCurrentUser, updateUserFirebase} }>
            {children}
        </UserContext.Provider>
    );
}



