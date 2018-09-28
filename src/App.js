import React,{ Component} from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import img from './img1.jpg'
import img2 from './img2.png'
import {BrowserRouter as Router, Route,Link, HashRouter, Redirect} from "react-router-dom"

import YouTube from 'react-youtube';

import firebase from 'firebase/app'
import 'firebase/database'
import { FirebaseConfig } from "./config/dev";

require('dotenv').config()



class Bid extends Component{


    constructor(props){
        super(props);

        this.state = {
            target: 10,
            range: 10,
            final: 0,
            history: [],
            templinks: [],
            accepted: 'false',
            value: 'make bid, accepted if above random minimum value, and have to change',
            database: ''
        }

        this.onInputClick = this.onInputClick.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.onButtonClick = this.onButtonClick.bind(this)
        this.componentDidMount = this.componentDidMount.bind(this)
    }


    componentDidMount(props){
        //so only once
        console.log("fff")
        const db = firebase.initializeApp(FirebaseConfig).database().ref()
        this.setState({database: db})




        var thiskey = ""
        var thisval = ""
        db.orderByKey().limitToFirst(1).once('value', snapshot=> {
            snapshot.forEach(singlesnap =>{
                thiskey = singlesnap.key
                thisval = singlesnap.val()
                //db.child(thiskey).remove()
            })
        });


        //tostring
        // this.state.database.child("1").remove()
        //snapshot.forEach( childsnaphtr=>{function})
        // console.log(childSnapshot.key)

    }

    onInputClick(props){
        this.setState({value: ''})
    }
    handleChange(event){
        if(this.state.accepted=='false'){
        this.setState({value: event.target.value});
    }
    }
    onButtonClick(event){
        console.log(this.state.history)
        //
        var currentval = this.state.value
        if(this.state.history.indexOf(currentval) <= -1 && this.state.final==0 && this.state.accepted=='false'){
            var randvar = Math.random()*(this.state.target)
            console.log(randvar)
            if(this.state.value>randvar){
                this.setState({final:currentval, value: currentval+", accepted, pay then wait for download", accepted: 'true'})
                console.log(this.state.final)
            }
        }

        var temphistory = this.state.history
        temphistory.push(currentval)
        this.setState({history: temphistory})

    // this.state.database.on('child_added',snap => {
    //     console.log("database snap")
    //     console.log(snap)

    // })
}

    render(){

        let client = {
            sandbox:    'AXjFV2K0-DX4liEvACG08YvR-CvrVuMpz1KmfskCHIhQ2R4qhs7_pMErMsIbHshwC0pca76su9vqUr0N', // from https://developer.paypal.com/developer/applications/
            production: process.env.REACT_APP_paypalkey  // from https://developer.paypal.com/developer/applications/
        };

        let style = {
            layout: 'horizontal',  // horizontal | vertical
            size:   'small',    // medium | large | responsive
            shape:  'rect',      // pill | rect
            color:  'blue',       // gold | blue | silver | black
            tagline: 'false',
        };

        // pass payment details

        let payment = (data,actions) => {
            return actions.payment.create({
                transactions: [
                    {
                        amount: {
                            total:    this.state.final.toString(),
                            currency: 'USD'
                        }
                    }
                ]
            });
        };




        let onAuthorize = (data, actions) => {
            return actions.payment.execute().then(function(response) {
                console.log('The payment was completed!');


                ///HOW TO KEEP TRAKC AHPEPING LVIEI WHTOUT A SERVER,, doesnt need to be random,, just fetch this list from server,, and remove when it has been accessed
                <Redirect to = {this.state.downloadlinks[Math.floor(Math.random()*this.state.downloadlinks.length)]} />
                //FIREBASE SERVER, LINKS ACCESSED THEN REMOVED,, LINKS FROM MEDIAFIRE



            });




            //REACT ROUTER REDIRECT TO 1 OF RANDOM DOWNLOAD LINKS
        };
        
        let PayPalButton = window.paypal.Button.driver('react', { React, ReactDOM });

        return (
            <div>
            <input type = "text" onClick = {this.onInputClick} value = {this.state.value} onChange = {this.handleChange}/>
            <button onClick={this.onButtonClick}>bid</button>


            <PayPalButton
                client={client}
                payment={payment}
                commit={this.state.accepted}
                return = {"dd"}
                style={style}
                onAuthorize={onAuthorize} />
        </div>
        );
    }
};








class App extends Component {
  render() {
    return (
      <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh'}}>

        <div>ben macintosh selected</div>

        <img src={img2} alt="" width="88"/>

        <div>

        new precedence
        </div>

        <div>
        <a href="https://google.com" style={{color:'blue'}}>google</a>
        </div>

        <div>
        <Bid/>
        </div>

        <p/>

        <YouTube
  videoId={"3W7iv7Mw3Jw"}
  />  








      </div>
    );
  }
}

export default App;