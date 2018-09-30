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



class Bid extends Component{


    constructor(props){
        super(props);

        this.state = {
            target: 10,
            range: 10,
            final: 0,
            history: [],
            accepted: 'false',
            value: 'make bid, accepted if above random minimum value, and have to change',
            downloadlink: "",
        }

        this.onInputClick = this.onInputClick.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.onButtonClick = this.onButtonClick.bind(this)
        this.componentDidMount = this.componentDidMount.bind(this)
    }


    componentDidMount(props){
        //so only once
        console.log("fff")


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
            }else{
            console.log("ggg")
            this.setState({value: currentval+"try another value"})
        }
        }else{
            this.setState({value: currentval+"already entered"})
        }

        var temphistory = this.state.history
        temphistory.push(currentval)
        this.setState({history: temphistory})

        ///HOW TO KEEP TRAKC AHPEPING LVIEI WHTOUT A SERVER,, doesnt need to be random,, just fetch this list from server,, and remove when it has been accessed
        //this.props.history.push({thisval})
        // <Redirect to = {thisval} />
        // <a href = {thisval} style={{color:'blue'}}> {thisval}</a>
        //FIREBASE SERVER, LINKS ACCESSED THEN REMOVED,, LINKS FROM MEDIAFIRE

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
                    this.setState({downloadlink:thisval})
                })
            });



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

                <a href = {this.state.downloadlink} style={{color:'blue'}}> {this.state.downloadlink} </a>
        </div>


        );
    }
};





  //       <YouTube
  // videoId={"3W7iv7Mw3Jw"}
  // />  

class App extends Component {
  render() {
    return (
      <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh'}}>

        <div>songs for music macintosh archival documents (sonnets for cnn)</div>
        <p>
        1. I love watching the 2. evening parisian train 3. icecube paperweight 4. panther bear sticker 5. FLLINGLIKE66 6. harbour focus 7. mad rush (to see you) 8. small britney4 9. summer learn 10. why sit 11. my best mind 12. he was a friend of mine 13. henri can sit 14. pre syria 15. smile its miles 16. ok freestyle 17. tech III 18. comfortable, ALRIGHT 19. thanking you 20. patrolling from the sky 21. forgiven 4 reference 22. join the dance 23. mix2 24. after show lone 25. all fits 26. wishes both his eyes were glass 27. magnet research 28. the bad 29. waking jet-1 30. ice storm 31. fly to class 32. 90s info 33. tunnel3 34. intermission 35. supergirl 36. walking sideways 37. WHOS RESIDENCY 38. underwater sandstone 39. take out 40 40. not so well 41. talk to your friends 42. no heart hotel 43. daytime mind 44. blue dream fuck 45. in this bin 46. be nice 47. money on 48. new sadness 49. sample this 50. Emerson 974 51. restyourlove 52. digital water interlude 53. take your time 54. welldone 55. bea1 56. bwv106 57. Free melodys 58. globalised trees 59. sony freestyle 60. beautiful stairs 61. pop goes the weasal across the universe 62. walk5 63. WALK UP 64. skys 65. battle time 66. nocturne 67. small hand man sun 68. roville let go 69. now and again 70. greatnss
        </p>ass

        <p>
        construction with sydney, friends, miles, henri, september
        </p>


        <div>
        <Bid/>
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