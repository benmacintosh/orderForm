import React,{ Component} from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import img from './img1.jpg'
import img2 from './img2.jpg'
import {BrowserRouter as Router, Route,Link, HashRouter, Redirect} from "react-router-dom"

import YouTube from 'react-youtube';

import firebase from 'firebase/app'
import 'firebase/database'
import { FirebaseConfig } from "./config/dev";

import {withRouter} from 'react-router-dom'


//ghpages/npm run deploy cant minify this, all breaks
//require('dotenv').config()





class Form extends Component {

    constructor(props) {
        super(props);   
        this.state = {
            number: "entering existing number will replace corresponding order",
            notes: "notes",
            address: "enter address, (within ~5km of Newtown)",
            latlng: ["",""],
            pay: "minimum $22",
            paid: ["cash on delivery<","paypal now"]
        };

        this.handleChange = this.handleChange.bind(this);
        this.onClickAuto1 = this.onClickAuto1.bind(this);
        this.onClickAuto2 = this.onClickAuto2.bind(this);
        this.onClick= this.onClick.bind(this);
        this.onClickSubmit = this.onClickSubmit.bind(this);
        this.handleAutoChange=this.handleAutoChange.bind(this);
    }

    handleChange(event){
        this.setState({[event.target.name]: event.target.value});
    }

    handleAutoChange(event){
        this.setState({[event.target.name]: event.target.value});
        var autocompleteapi = new window.google.maps.places.Autocomplete(document.getElementById(this.state.id));
        var latlng = ["",""]
        var tempsetstate = this.setState.bind(this)

        window.google.maps.event.addListener(autocompleteapi, 'place_changed', function () {
            var place = autocompleteapi.getPlace()
            var address = [
            (place.address_components[0] && place.address_components[0].short_name || ''),
            (place.address_components[1] && place.address_components[1].short_name || ''),
            (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');

            latlng = [place.geometry.location.lat(),place.geometry.location.lng()]
            tempsetstate({latlng: latlng})
        })

        //CHECK WITHIN RANGE
    }

    onClickAuto1(event){
        this.setState({paid:["cash on delivery","paypal now"]})
        this.setState({paid:this.state.paid[0]})
        this.setState({paid:["cash on delivery<","paypal now"]})

    }
    onClickAuto2(event){
        this.setState({paid:["cash on delivery","paypal now"]})
        this.setState({paid:this.state.paid[1]})
        this.setState({paid:["cash on delivery","paypal now<"]})

    }
    componentDidUpdate(props){
        //this.props.callFromKids(this.state);
    }

    onClickSubmit(event){
                //PERFORM CHECKS

        //if ok, then push to firebase
    }
    onClick(event){

        this.setState({[event.target.name]: ""})
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
                        total:    this.state.pay,
                        currency: 'AUD'
                    }
                }
                ]
            });
        };


        var that = this
        console.log(that.state)

        let onAuthorize = (data, actions) => {
            return actions.payment.execute().then(function(response) {
                console.log('The payment was completed!');

                that.setState({paid: ["cash on delivery","paypal ACCEPTED<"]})


                const db = firebase.initializeApp(FirebaseConfig).database().ref()

                var thiskey = ""
                var thisval = ""
                console.log(db)
                db.orderByKey().limitToFirst(1).once('value', snapshot=> {
                    snapshot.forEach(singlesnap =>{

                        console.log(singlesnap)
                        thiskey = singlesnap.key
                        thisval = singlesnap.val()

                        db.child(thiskey).remove()

                        console.log("thisval")
                        console.log(thisval)
                        that.setState({downloadlink:thisval})
                    })
                });


            });




            //REACT ROUTER REDIRECT TO 1 OF RANDOM DOWNLOAD LINKS
        };
        
        let PayPalButton = window.paypal.Button.driver('react', { React, ReactDOM });







        if(this.state.paid[1]=="paypal now<"){


            return (
                <div>

                <input type = "text" name = "number" value = {this.state.number} onChange = {this.handleChange} onClick={this.onClick} />
                <input type = "text" name = "notes" value = {this.state.notes} onChange = {this.handleChange} onClick={this.onClick} />
                <input type = "text" id={this.state.id} name = "address" value = {this.state.address} onChange = {this.handleAutoChange} onClick={this.onClick} />
                <input type = "text" name = "pay" value = {this.state.pay} onChange = {this.handleChange} onClick={this.onClick} />

                <a onClick={this.onClickAuto1} style={{color:'blue', cursor: 'pointer', textDecorationLine: 'underline'}}>{this.state.paid[0]}</a>
                <a>, </a>
                <a onClick={this.onClickAuto2} style={{color:'blue', cursor: 'pointer', textDecorationLine: 'underline'}}>{this.state.paid[1]}</a>


                <input type = "text" onClick = {this.onInputClick} value = {this.state.value} onChange = {this.handleChange}/>
                <button onClick={this.onButtonClick}>bid</button>
                <PayPalButton
                client={client}
                payment={payment}
                commit={this.state.accepted}
                return = {"dd"}
                style={style}
                onAuthorize={onAuthorize} />


                <button onClick={this.onClickSubmit}>_submit</button>

                </div>


                );
        }else{


            return(
                <div>

                <input type = "text" name = "number" value = {this.state.number} onChange = {this.handleChange} onClick={this.onClick} />
                <input type = "text" name = "notes" value = {this.state.notes} onChange = {this.handleChange} onClick={this.onClick} />
                <input type="text" id={this.state.id} name = "address" value = {this.state.address} onChange = {this.handleAutoChange} onClick={this.onClick} />
                <input type = "text" name = "pay" value = {this.state.pay} onChange = {this.handleChange} onClick={this.onClick} />

                <a onClick={this.onClickAuto1} style={{color:'blue', cursor: 'pointer', textDecorationLine: 'underline'}}>{this.state.paid[0]}</a>
                <a>, </a>
                <a onClick={this.onClickAuto2} style={{color:'blue', cursor: 'pointer', textDecorationLine: 'underline'}}>{this.state.paid[1]}</a>



                </div>
                );
        }
    }
}








class App extends Component {
    constructor(props){
        super(props);
        this.state={flowersleft:""}
    }
    render() {
        return (
          <div>

          <Form/>

          <p></p>

          <div>
          $flowers remaining {this.state.flowersleft}
          </div>

          <div>
          construction with sydney, friends, miles, henri, september
          </div>


          <img src={img2} alt="" width="88"/>

          <div>
        <a href="https://www.youtube.com/watch?v=ql6JEBL1X88" style={{color:'blue'}}>https://www.youtube.com/watch?v=ql6JEBL1X88</a>
        </div>



        </div>
        );
    }
}

export default App;