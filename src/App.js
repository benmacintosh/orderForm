import React,{ Component} from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import img1 from './img1.png'
import {BrowserRouter as Router, Route,Link, HashRouter, Redirect} from "react-router-dom"

import YouTube from 'react-youtube';

import firebase from 'firebase/app'
import 'firebase/database'
import { FirebaseConfig } from "./config/dev";

import {withRouter} from 'react-router-dom'


const db = firebase.initializeApp(FirebaseConfig).database()


class Form extends Component {

    constructor(props) {
        super(props);   
        this.state = {
            number: "entering existing number will replace corresponding order",
            number_boolean: 0,
            notes: "notes",
            address: "enter address, (within ~5km of Newtown)",
            address_boolean: 0,
            time: "",
            time_boolean: 0,
            latlng: {lat:-33.896358, lng:151.183868}, ///temp
            pay: "minimum $22",
            paid: ["cash on delivery<","paypal now"],
            paid_boolean: 0,
            originlatlng: {lat:-33.896358, lng:151.183868},
            submitting_boolean: 0,
        };

        this.handleChange = this.handleChange.bind(this);
        this.onClickAuto1 = this.onClickAuto1.bind(this);
        this.onClickAuto2 = this.onClickAuto2.bind(this);
        this.handleNumberChange = this.handleNumberChange.bind(this);
        this.onClick= this.onClick.bind(this);
        this.getDistance = this.getDistance.bind(this)
        this.onClickSubmit = this.onClickSubmit.bind(this);
        this.handleAddressChange=this.handleAddressChange.bind(this);
        this.handleTimeChange = this.handleTimeChange.bind(this);
    }

    componentDidMount(){

        //get current server state
        //but cnat put firebase server in state (ie which then set to firebase)
        // this.setState({current_server: db})

    }

    handleChange(event){
        this.setState({[event.target.name]: event.target.value, number_boolean: 1});
    }

    handleNumberChange(event){
        this.setState({[event.target.name]:event.target.value, address_boolean: 1})
    }

    handleTimeChange(event){
        var max = 1300
        var min = 1000
        console.log(event.target.value)
        var time = event.target.value
        time = (time.replace(":",""))
        console.log(time>max)
        if(time>max){
            console.log("big")
            this.setState({time:"13:00"})
        }if(time<min){
            this.setState({time:"10:00"})
        }if(time<max && time > min){
        this.setState({time:event.target.value, time_boolean: 1})
    }
    }

    handleAddressChange(event){
        this.setState({[event.target.name]: event.target.value});
        var autocompleteapi = new window.google.maps.places.Autocomplete(document.getElementById(66));
        var latlng = ["",""]
        var that = this
        window.google.maps.event.addListener(autocompleteapi, 'place_changed', function () {
            var place = autocompleteapi.getPlace()
            var address = [
            (place.address_components[0] && place.address_components[0].short_name || ''),
            (place.address_components[1] && place.address_components[1].short_name || ''),
            (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');

            console.log("ass")
            latlng = [place.geometry.location.lat(),place.geometry.location.lng()]
            that.setState({latlng: latlng})
            if(that.getDistance(latlng,that.state.originlatlng)>5000){
                that.setState({address: "must be less than 5km from Newtown", accept: 0})
            }
            else{
                that.setState({address_boolean: 1})
            }
        })
        
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



    getDistance(p1, p2) {
    var rad = function(x) {
      return x * Math.PI / 180;
    };
      var R = 6378137; // Earth’s mean radius in meter
      var dLat = rad(p2.lat - p1.lat);
      var dLong = rad(p2.lng - p1.lng);
      var a = Math.sin(dLat/2)*Math.sin(dLat/2)+Math.cos(rad(p1.lat))*Math.cos(rad(p2.lat))*Math.sin(dLong/2)*Math.sin(dLong/2)
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c;
      return d; // returns the distance in meter
    };


    onClickSubmit(event){
                //PERFORM CHECKS
        console.log("submitted")
        this.setState({submitting_boolean: 1})




        //var db = this.state.current_server;




        db.ref().once('value', data => { 
            //GET ORIGINS
            console.log("fetched intial server data")
            var dbvals = data.val()
            dbvals = Object.values(dbvals)
            console.log(dbvals)
            var origins = []
            for(var i=0; i<dbvals.length;i++){
            origins.push(dbvals[i].data.latlng)
            }

            //nearest current server point in space
            var mindistance = Infinity;
            var mindex = 0;
            var closest = this.state.latlng
            for(var i=0; i<origins.length; i++){
                var thislatlng = origins[i]
                console.log("this")
                console.log(thislatlng)
                var thisdistance = this.getDistance(thislatlng, this.state.latlng)
                console.log("this ditsance")
                console.log(thisdistance)
                if(thisdistance<mindistance){
                    mindistance=thisdistance;
                    closest=thislatlng
                    mindex=i;
                }
                console.log("clsoet")
                console.log(closest)
            }

            //time from this point to new point
            var time_to_reach_new_point_from_nearest
            var that = this
            console.log(that.state.latlng)
            setTimeout(function(){
                var distanceapi = new window.google.maps.DistanceMatrixService;
                distanceapi.getDistanceMatrix({
                    origins: [closest],
                    destinations: [that.state.latlng],
                    travelMode: 'BICYCLING',//TRANSIT
                    unitSystem: window.google.maps.UnitSystem.METRIC
                },function(response,status){

                    console.log("did soemthing api")
                    if(status!=='OK'){
                        alert('Error was: '+ status);
                        //IF OVER QUERY LIMIT THEN DEALY LONGER
                    }else{
                        console.log("disance response")
                        for(var k = 0; k<response.rows.length;k++){
                            if(response.rows[k].elements[k].duration ){
                                time_to_reach_new_point_from_nearest = response.rows[k].elements[k].duration.value
                        }else{
                            console.log("uncreachable")
                        }
                        }
                    }





//WORKING TO HERE






            //check this time is than difference between timedue of both points
            console.log("timed,  timetoeach")
            console.log(time_to_reach_new_point_from_nearest)
            var timediff_closest_andnewpoint = Math.abs((dbvals[mindex].data.time)-(that.state.time))
            if(timediff_closest_andnewpoint<time_to_reach_new_point_from_nearest){
                that.setState({time_boolean: 1})
            }






            //the submit if ok, number in, address ok, paid ok, and time
            console.log("try submit")
            console.log(db)
            console.log(that.state.number)
            console.log(that.state)
            if(that.state.address_boolean && that.state.number_boolean && that.state.time_boolean && that.state.paid_boolean){
                db.ref(that.state.number).update({
                    data:that.state
                });          
            }



                }
                )
            },1100)
   
        })

        // db.orderByKey().limitToFirst(1).once('value', snapshot=> {
        //     snapshot.forEach(singlesnap =>{

        //         console.log(singlesnap)
        //         thiskey = singlesnap.key
        //         thisval = singlesnap.val()

        //         db.child(thiskey).remove()

        //         console.log("thisval")
        //         console.log(thisval)
        //         that.setState({downloadlink:thisval})
        //     })
        // });

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

                that.setState({paid: ["cash on delivery","paypal ACCEPTED<"],paid_boolean: 1})


            });




            //REACT ROUTER REDIRECT TO 1 OF RANDOM DOWNLOAD LINKS
        };
        
        let PayPalButton = window.paypal.Button.driver('react', { React, ReactDOM });
















        if(this.state.paid[1]=="paypal now<"){


            return (
                <div>

                <input type = "text" name = "number" value = {this.state.number} onChange = {this.handleChange} onClick={this.onClick} />
                <input type = "text" name = "notes" value = {this.state.notes} onChange = {this.handleChange} onClick={this.onClick} />
                <input type = "text" id={66} name = "address" value = {this.state.address} onChange = {this.handleAddressChange} onClick={this.onClick} />
                deliver by (subject to availability)
                <input type = "text" name = "pay" value = {this.state.pay} onChange = {this.handleChange} onClick={this.onClick} />

                <a onClick={this.onClickAuto1} style={{color:'blue', cursor: 'pointer', textDecorationLine: 'underline'}}>{this.state.paid[0]}</a>
                <a>, </a>
                <a onClick={this.onClickAuto2} style={{color:'blue', cursor: 'pointer', textDecorationLine: 'underline'}}>{this.state.paid[1]}</a>


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

                <input type = "text" name = "number" value = {this.state.number} onChange = {this.handleNumberChange} onClick={this.onClick} />
                <input type = "text" name = "notes" value = {this.state.notes} onChange = {this.handleChange} onClick={this.onClick} />
                <input type = "text" id={66} name = "address" value = {this.state.address} onChange = {this.handleAddressChange} onClick={this.onClick} />
                deliver by (subject to availability)
                <input type = "time" value = {this.state.time} onChange = {this.handleTimeChange} />
                <input type = "text" name = "pay" value = {this.state.pay} onChange = {this.handleChange} onClick={this.onClick} />

                <a onClick={this.onClickAuto1} style={{color:'blue', cursor: 'pointer', textDecorationLine: 'underline'}}>{this.state.paid[0]}</a>
                <a>, </a>
                <a onClick={this.onClickAuto2} style={{color:'blue', cursor: 'pointer', textDecorationLine: 'underline'}}>{this.state.paid[1]}</a>







                <button onClick={this.onClickSubmit}>_submit</button>

                </div>
                );
        }
    }
}






class App extends Component {
    constructor(props){
        super(props);
        this.state={flowersleft:0,flowerfloatvalue:1500}
    }
    componentDidMount(props){
        
        db.ref().once('value', data => { 

        console.log("getting spent")
        var dbvals = data.val()
        dbvals = Object.values(dbvals)
        var totalspent = 0
        for(var i=0; i<dbvals.length;i++){
            totalspent = (totalspent) + parseInt(dbvals[i].data.pay)
        }
        var left = this.state.flowerfloatvalue-totalspent;
        console.log(left)
        this.setState({flowersleft: left})
    }
    )
    }
    render() {
        return (
          <div>
          \this sat

          <div>
          $flowers remaining {this.state.flowersleft}
          </div>

          <Form/>

          <p></p>



          <div>
          </div>



          display image while submitting
          <img src={img1} alt="" width="166"/>
          ...



          <div>
        <a href="https://www.youtube.com/watch?v=DRrj1Y5oazA" style={{color:'blue'}}>https://www.youtube.com/watch?v=DRrj1Y5oazA</a>
        </div>



        </div>
        );
    }
}

export default App;