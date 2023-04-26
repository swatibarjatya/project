import React, {useState,setState} from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';



const apiURL = "http://localhost:8080/api/movies";


function CreateMovie() {
    
    //const history = useHistory();
    const navigate = useNavigate();

    const [movieNumber, setMovieNumber] = useState(null);
    const [title, setTitle] = useState(null);
    const [durationInMin,setDurationInMin] = useState(null);
    const [language,setLanguage] = useState(null);
    const [releaseDate,setReleaseDate] = useState(null);
    const [country,setCountry] = useState(null);
    const [genre,setGenre] = useState(null);
    

    const handleInputChange = (e) => {
        const {id , value} = e.target;
        if(id === "movieNumber"){
            setMovieNumber(value);
        }
        if(id === "title"){
            setTitle(value);
        }
        if(id === "durationInMin"){
            setDurationInMin(value);
        }
        if(id === "language"){
            setLanguage(value);
        }
        if(id === "releaseDate"){
            setReleaseDate(value);
        }
        if(id === "country"){
            setCountry(value);
        }
        if(id === "genre"){
            setGenre(value);
        }
       

    }

    const handleSubmit  = () => {
        console.log("");

        fetch(apiURL, {
            method: 'POST',
            body: JSON.stringify({
              // Add parameters here
                movieNumber: movieNumber,
                title: title,
                durationInMin: durationInMin,
                language: language,
                releaseDate: releaseDate,
                country: country,
                genre: genre
            }),
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
        })
        .then((response) => response.json())
        .then(res => this.setState({ apiResponse: res }))
        .then((data) => {
            console.log(data);
        // Handle data
        })
        .catch((err) => {
            console.log(err.message);
        });
        
        //history.push('./MovieSearch');
        navigate('./MovieSearch');
    }

    return(
        <div className="form">
            <div className="form-body">
                <div className="movieNumber">
                    <label className="form__label" for="movieNumber">Movie Number </label>
                    <input className="form__input" type="text" value={movieNumber} onChange = {(e) => handleInputChange(e)} id="movieNumber" placeholder="Movie Number"/>
                </div>
                <div className="title">
                    <label className="form__label" for="title">Title </label>
                    <input  type="text" name="" id="title" value={title}  className="form__input" onChange = {(e) => handleInputChange(e)} placeholder="title"/>
                </div>
                
                <div className="durationInMin">
                    <label className="form__label" for="durationInMin">Duration In Min </label>
                    <input  type="text" id="durationInMin" className="form__input" value={durationInMin} onChange = {(e) => handleInputChange(e)} placeholder="durationInMin"/>
                </div>
                <div className="language">
                    <label className="form__label" for="language">Language </label>
                    <input className="form__input" type="text"  id="language" value={language} onChange = {(e) => handleInputChange(e)} placeholder="language"/>
                </div>
                <div className="releaseDate">
                    <label className="form__label" for="releaseDate">Release Date </label>
                    <input className="form__input" type="text" id="releaseDate" value={releaseDate} onChange = {(e) => handleInputChange(e)} placeholder="releaseDate"/>
                </div>
                <div className="country">
                    <label className="form__label" for="country">Country </label>
                    <input className="form__input" type="text" id="country" value={country} onChange = {(e) => handleInputChange(e)} placeholder="country"/>
                </div>
                <div className="genre">
                    <label className="form__label" for="genre">Genre </label>
                    <input className="form__input" type="text" id="genre" value={genre} onChange = {(e) => handleInputChange(e)} placeholder="genre"/>
                </div>

            </div>
            <div class="footer">
                <button onClick={()=>handleSubmit()} type="submit" class="btn">Register</button>
            </div>
        </div>
        )       
    }
    
    export default CreateMovie;
