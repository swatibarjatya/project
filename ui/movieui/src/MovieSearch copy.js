import React from "react";

import './App.css';

//create react class, component and function for UI inputs and save button for contract movie from file ../../../contracts/movie.sol
export class Movie extends React.Component {
    state = { movie: "", loading: true, saving: false };
    //add constructor
    constructor(props) {
        super(props);
        this.state = {
            apiResponse: "",
        };
           
        
    }

    async _saveMovie() {
        
    }
    
    async _getAllMovies() {
        const response = fetch("http://localhost:8080/api/movies")
        this.state.apiResponse = (await response).json();
            //.then(res => res.json())
            //.then(res => this.setState({ apiResponse: res }))
            //.catch(err => err);
    }

    callAPI() {
        fetch("http://localhost:8080/api/movies")
            .then(res => res.text())
            .then(res => this.setState({ apiResponse: res }));
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
                <form>  </form>

                <label>Movies: {this.state.apiResponse}</label>

                <div>
                    {this.state.apiResponse.length > 0 && (
                        <ul>
                        
                        </ul>
                    )}
                </div>
            </div>
        )
    }

    
}