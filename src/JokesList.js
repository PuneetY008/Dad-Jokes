import React, { Component } from 'react';
import Joke from './Joke';
import axios from 'axios';
import { v4 as uuidv } from 'uuid';
import './JokesList.css';

class JokeList extends Component{
    static defaultProps = {
        numJokesToGet: 10
    }

    constructor(props){
        super(props);
        this.state = {
            jokes: JSON.parse(window.localStorage.getItem("jokes")) || "[]"
        }
        this.handleClick = this.handleClick.bind(this);
    }

    async componentDidMount(){
        if(this.state.jokes.length === 0) this.getJokes();
    }

    async getJokes(){
        let jokes = [];
        for(let i=0; i<this.props.numJokesToGet;i++){
            let res = await axios.get('https://icanhazdadjoke.com/', {headers: {Accept: 'application/json'}});
            jokes.push({id: uuidv(),text: res.data.joke, votes:0});
        }
        this.setState(st=>({jokes: [...st.jokes,...jokes]}),()=>window.localStorage.setItem('jokes',JSON.stringify(this.state.jokes)));
    }

    handleVote(id,change){
        this.setState(st=>({
            jokes: st.jokes.map(j=>
                j.id === id? {...j,votes: j.votes+change}: j)
        }),()=>window.localStorage.setItem('jokes',JSON.stringify(this.state.jokes)));
    }

    handleClick(){
        this.getJokes();
    }

    render(){
        return(
            <div className='JokesList'>
                <div className='JokesList-sidebar'>
                    <h1 className='JokesList-title'><span>Dad</span>Jokes</h1>
                    <img src='https://image.shutterstock.com/z/stock-photo-the-emoji-yellow-face-lol-laugh-and-crying-tear-icon-669849526.jpg' />
                    <button onClick={this.handleClick}>Add Jokes!</button>
                </div>
                <div className='JokesList-jokes'>
                    {this.state.jokes.map(j=>(
                        <Joke key={j.id} votes= {j.votes} text= {j.text} upvote= {()=>this.handleVote(j.id,1)} downvote= {()=>this.handleVote(j.id,-1)} />
                ))}
                </div>
                
            </div>
        );
    }
}

export default JokeList;