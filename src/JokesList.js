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
            jokes: JSON.parse(window.localStorage.getItem("jokes")) || "[]",
            loading: false
        }
        this.handleClick = this.handleClick.bind(this);
        this.seenJokes = new Set(this.state.jokes.map(j=>j.text));
    }

    async componentDidMount(){
        if(this.state.jokes.length === 0) this.getJokes();
    }

    async getJokes(){
        try{
            let jokes = [];
            while(jokes.length <= this.props.numJokesToGet){
                let res = await axios.get('https://icanhazdadjoke.com/', {headers: {Accept: 'application/json'}});
                let newJoke = res.data.joke;
                if(!this.seenJokes.has(newJoke)){
                    jokes.push({id: uuidv(),text: res.data.joke, votes:0});
                }else{
                    console.log('joke exixts');
                } 
            }
            this.setState(st=>({loading: false,jokes: [...st.jokes,...jokes]}),()=>window.localStorage.setItem('jokes',JSON.stringify(this.state.jokes)));
        } catch(e){
            alert(e);
        }
    }

    handleVote(id,change){
        this.setState(st=>({
            jokes: st.jokes.map(j=>
                j.id === id? {...j,votes: j.votes+change}: j)
        }),()=>window.localStorage.setItem('jokes',JSON.stringify(this.state.jokes)));
    }

    handleClick(){
        this.setState({loading: true},this.getJokes);
        
    }

    render(){
        if(this.state.loading){
            return(
                <div className='JokeList-spinner'>
                    <i className='far fa-8x fa-laugh fa-spin'></i>
                    <h1 className='JokesList-title'>Loading...</h1>
                </div>
            );
        }
        let jokes = this.state.jokes.sort((a,b)=> b.votes-a.votes);
        return(
            <div className='JokesList'>
                <div className='JokesList-sidebar'>
                    <h1 className='JokesList-title'><span>Dad</span>Jokes</h1>
                    <img src='https://image.shutterstock.com/z/stock-photo-the-emoji-yellow-face-lol-laugh-and-crying-tear-icon-669849526.jpg' />
                    <button onClick={this.handleClick}>Add Jokes!</button>
                </div>
                <div className='JokesList-jokes'>
                    {jokes.map(j=>(
                        <Joke key={j.id} votes= {j.votes} text= {j.text} upvote= {()=>this.handleVote(j.id,1)} downvote= {()=>this.handleVote(j.id,-1)} />
                ))}
                </div>
                
            </div>
        );
    }
}

export default JokeList;