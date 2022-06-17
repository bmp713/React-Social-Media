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

    useEffect( () => {
        let id = window.localStorage.getItem('currentUserID' );
        console.log("UserContext mounted currentUser =>", currentUser);
        console.log("UserContext mounted localStorage => ", window.localStorage.getItem('currentUserID' ) );

        if( id ){
            //window.localStorage.setItem('currentUserID', JSON.stringify(currentUser));
            setCurrentUserID(id);
            //readprofile(id);
        }
    },[]);

    useEffect( () => {
        let id = window.localStorage.getItem('currentUserID' );
        console.log("UserContext changed localStorage => ", id );
        console.log("UserContext changed currentUser =>", currentUser);

        window.localStorage.setItem('currentUserID', JSON.stringify(currentUserID));
    });

    useEffect(() => {
        return () => {
          console.log("UserContext dismount currentUser =>", currentUser);
          //window.localStorage.setItem('currentUserID', JSON.stringify(currentUserID));
        };
    }, []); 

    // Login updates the user data with a name parameter    
    const login = (name, password) => {
        return signInWithEmailAndPassword(auth, name, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log( name, 'signed in' );
                readprofile( auth.currentUser.uid );
                setCurrentUserID(auth.currentUser.uid);

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
                    last: doc.data().last
                }));
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
            let doc = await addDoc( collection(db, 'users'), {
                id: id,
                first: first,
                last: last,
                email: email
            });
            console.log('addDoc id => '+ id);
        }catch(error){
            console.log('createUserFirebase() => ', error);
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
            last: ''
        }));
        signOut( auth )
            .then( () => {
                console.log( currentUser.name, 'signed out' );
            }).catch((error) => {
                console.log("logout()", error);
            });
    };

    // Wrapper for Context Provider
    return (
        <UserContext.Provider value={ {currentUser, login, logout, signup, reset} }>
            {children}
        </UserContext.Provider>
    );
}



