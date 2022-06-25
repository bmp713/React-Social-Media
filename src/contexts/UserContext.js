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
    const [currentUserIMG, setCurrentUserIMG] = useState('id');

    
    // console.log("UserContext localStorage => ", window.localStorage.getItem('currentUserID' ) );
    // If Freezes
    // Fixes state on refresh
    //window.localStorage.setItem('currentUserID', JSON.stringify(currentUserID))

    useEffect( () => {
        console.log("useEffect localStorage => ", JSON.parse( window.localStorage.getItem('currentUserID')) );
        console.log("useEffect => currentUserID =>", currentUserID );

        readprofile( JSON.parse( window.localStorage.getItem('currentUserID')) );
        setCurrentUserID( JSON.parse( window.localStorage.getItem('currentUserID')) );
    },[]);

    // Login updates the user data with a name parameter    
    const login = (name, password) => {

        return signInWithEmailAndPassword(auth, name, password)
            .then((userCredential) => {
                console.log( name, 'signed in' );
                readprofile( auth.currentUser.uid );
                setCurrentUserID(auth.currentUser.uid);

                window.localStorage.setItem('currentUserID', JSON.stringify(auth.currentUser.uid));
                console.log("login localStorage => ", window.localStorage.getItem('currentUserID' ) );
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
                    email: doc.data().email,
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
            await setDoc( doc( db, "users", id), {
                id: id,
                email: email,
                first: first,
                last: last,
                imgURL: './assets/Icon-headshot.png',
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
                email: currentUser.email,
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
            email: '',
            first: '',
            last: '',
            imgURL: '',
            friends: ''
        }));

        window.localStorage.setItem('currentUserID', '');
        //window.localStorage.setItem('currentUserID', JSON.stringify(currentUserID));
        
        console.log("UserContext localStorage =>", window.localStorage.getItem('currentUserID' ));
        console.log("logout currentUser =>", currentUser );

        signOut( auth )
            .then( () => {
                console.log( currentUser.email, 'signed out' );
            }).catch((error) => {
                console.log("logout()", error);
            });
    };

    // Wrapper for Context Provider
    return (
        <UserContext.Provider value={ {currentUser, setCurrentUserIMG, login, logout, signup, reset, setCurrentUser, updateUserFirebase} }>
            {children}
        </UserContext.Provider>
    );
}



