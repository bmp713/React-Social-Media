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

export default function News(){

    useEffect( () => {
        searchNews();
    }, []);

    // User authentication
    const {currentUser, login, logout} = useContext(UserContext);
    const [formData, setFormData] = useState({});
    
    const [articles, setArticles] = useState([]);
    const [numArticles, setNumArticles]= useState(2);
    const [maxArticles, setMaxArticles]= useState(0);

    // Create user additional profile data in users db
    const searchNews = async (e) => {
        //e.preventDefault();

        // NY Times API
        let url = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=news&api-key=l0pE8ZYsNeEx6MAKnAyKmNnxJrOhAfCB";
        url = "https://api.nytimes.com/svc/mostpopular/v2/viewed/30.json?api-key=l0pE8ZYsNeEx6MAKnAyKmNnxJrOhAfCB"
        url = "https://api.nytimes.com/svc/topstories/v2/us.json?api-key=l0pE8ZYsNeEx6MAKnAyKmNnxJrOhAfCB"

        try{
            await fetch(url)
                .then( response => response.json() )
                .then( data => {
                    console.log("NY Times data => ", data) 

                    setArticles(data.results);
                    setMaxArticles(data.num_results);

                    // articles.forEach( article => {
                    //     console.log( "\nimage =>", article.multimedia[0].url );                
                    //     console.log( "title =>", article.title );
                    //     console.log( "abstract =>", article.abstract );
                    //     console.log( "article =>", article.url );
                    // });
                });
        }catch(error){
            console.log(error);
        }
    }

    return(
            <div 
                className="row justify-content-lg-between align-items-start p-5 text-white"
                style={{
                    margin:'25px 0px', 
                    color:'#ffff', 
                    background: '#0009',
                    borderRadius: '2px',
                }}
            >
                <div className="col-lg-12 text-left">
                    <h2>NY Times                    
                        <span>
                        <button 
                            className="text-decoration-underline text-white float-end"
                            onClick={ () => { setNumArticles(maxArticles) }}
                        >
                        See all articles
                        </button></span>
                    </h2>
                    <hr></hr>  
                </div>
                <div className="col-lg-6 text-lg-end text-decoration-underline">
                </div>
                <div className="row text-left">
                        { articles.slice(0, numArticles).map( (article ) =>  
                            <div className="col-xl-5">
                                <a className="text-white" href={article.url} target="_blank">
                                    <img 
                                        height="125" 
                                        className="my-2" 
                                        src={article.multimedia !== null ? article.multimedia[0].url :''} alt=""
                                    ></img><br></br>

                                    <strong>{article.title}</strong>
                                </a><br></br><br></br>

                                <p>{article.abstract}</p>
                            </div>
                        )}
                </div>
                <button 
                    className="submit-btn"
                    style={{padding:'11px 0px', fontSize:'14px'}}
                    onClick={ () =>{ setNumArticles( numArticles + 2) }}
                >
                    Load more...
                </button>
                <hr></hr>  

            </div>
    )
}


