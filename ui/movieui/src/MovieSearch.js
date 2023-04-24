import React, { useState } from "react";

import './App.css';

//create react class, component and function for UI inputs and save button for contract movie from file ../../../contracts/movie.sol
export class Movie extends React.Component {
    //state = { movie: "", loading: true, saving: false };
    //add constructor
    constructor(props) {
        super(props);
        this.state = {
            movies: [{'title':'test'}, {'title':'test2'}],
        };
           
        
    }

    async _saveMovie() {
        
    }
    
    async _getAllMovies() {
        const response = fetch("http://localhost:8080/api/movies")
        this.state.movies = (await response).json();
        //console.log(this.state.movies[0].Record.title);
            //.then(res => res.json())
            //.then(res => this.setState({ apiResponse: res }))
            //.catch(err => err);
    }

    callAPI() {
        fetch("http://localhost:8080/api/movies")
            .then(res => res.text())
            .then(res => this.setState({movies:JSON.parse(res)}));
    }

    componentDidMount(){
        //this._getAllMovies();
        this.callAPI();
    }

    render(){

        //movie = this.state.movie;
        //this._getAllMovies();
        //function Movie({ movie, updateMovie }) {
            
        return (
            
            <div>
                <header>
                    <h1>Movie List</h1>
                </header>
                <form>
                    <button onClick={this.callAPI}>Fetch Movies</button>
                </form>
                
                
                <div>
                    {this.state.movies.length > 0 && (
                        <ul>
                        {this.state.movies.map((movie, index) => (
                            <li key={index}>Title: {movie.title}, Language:{movie.language}</li>
                        ))}
                        </ul>
                    )}
                </div>
            </div>
        )
    }

    
}