import React from "react"
import { HashRouter, Route } from 'react-router-dom';
import { observer } from "mobx-react";
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import Modal from 'react-bootstrap/Modal'
import ModalHeader from 'react-bootstrap/ModalHeader'
import ModalTitle from 'react-bootstrap/ModalTitle'
import ModalBody from 'react-bootstrap/ModalBody'
import ModalFooter from 'react-bootstrap/ModalFooter'

import PlayerCards from "../components/PlayerCards"
import StackCards from "../components/StackCards"
import CardStore from "../stores/cardStore"
import { observable, action } from 'mobx';
// import MobxInteraction from "../pages/MobxInteraction"


// Require scss files
require('../../stylesheets/_all.scss');

// require LESS files
require('../../stylesheets/initial.less');


@observer
export default class SaveModal extends React.Component {

  constructor(props){
    super(props);
    CardStore.fetchSavings();
  }
    render() {
     var {playersFromServer} = CardStore;
     var playerArray;
     if(playersFromServer!=undefined){
       playerArray = [...playersFromServer];
     }
     console.log("SaveModal: Saved Players")
     console.log(this.props.playerLength);
     console.log(playerArray.length);
     var {middleFromServer} = CardStore;
     var middleArray;
     if(middleFromServer!=undefined){
       middleArray = [...middleFromServer];
     }
     console.log("SaveModal: Saved Middle")
     console.log(this.props.middleLength);
     console.log(middleArray.length);
     var {usedFromServer} = CardStore;
     var usedArray;
     if(usedFromServer!=undefined){
       usedArray = [...usedFromServer];
     }
     console.log("SaveModal: Saved Used")
     console.log(this.props.usedLength);
     console.log(usedArray.length);
     var alert = [];
     if(this.props.playerLength==playerArray.length && this.props.middleLength==middleArray.length && this.props.usedLength==usedArray.length){
       alert.push(<h2 key="Player-Heading"> Saved Players </h2>);
       const savedPlayers = playerArray.map((player, key) =>{
           return(<div key={player.idPlayer}><p>{player.playerName}</p></div>);
       });
       alert.push(savedPlayers);
       alert.push(<h2 key="MiddleCards"> Cards in Middle: {middleArray.length}</h2>);
       alert.push(<h2 key="UsedCards"> Used Cards: {usedArray.length}</h2>);
     }else{
       alert.push("loading...")
     }
     console.log("Save Alert:")
     console.log(alert);
        return (
            <div>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body><Alert variant="warning"></Alert>{alert}</Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" href="/">
                    Leave
                  </Button>
                </Modal.Footer>
            </div>
        );
    }
}
