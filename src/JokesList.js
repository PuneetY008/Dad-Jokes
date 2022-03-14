import React, { Component } from 'react';
import axios from 'axios';
import './JokesList.css';

class JokeList extends Component{
    static defaultProps = {
        numJokesToGet: 10
    }

    constructor(props){
        super(props);
        this.state = {
            jokes: []
        }
    }

    async componentDidMount(){
        let jokes = [];
        for(let i=0; i<this.props.numJokesToGet;i++){
            let res = await axios.get('https://icanhazdadjoke.com/', {headers: {Accept: 'application/json'}});
            jokes.push(res.data.joke);
        }
        this.setState({
            jokes:jokes
        });
    }

    render(){
        return(
            <div className='JokesList'>
                <div className='JokesList-sidebar'>
                    <h1 className='JokesList-title'><span>Dad</span>Jokes</h1>
                    <img src='https://image.shutterstock.com/z/stock-photo-the-emoji-yellow-face-lol-laugh-and-crying-tear-icon-669849526.jpg' />
                    <button>Add Jokes!</button>
                </div>
                <div className='JokesList-jokes'>
                    {this.state.jokes.map(j=>(
                    <div>{j}</div>
                ))}
                </div>
                
            </div>
        );
    }
}

export default JokeList;