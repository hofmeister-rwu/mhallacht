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
import GameStore from "../stores/gameStore"
import { observable, action } from 'mobx';

import TooltipButton from "../components/TooltipButton"
// import MobxInteraction from "../pages/MobxInteraction"



@observer
export default class AlertModal extends React.Component {

  constructor(props){
    super(props);
  }
    render() {
      let dismiss;
      let hide = GameStore.modalClose;
      if(GameStore.dismiss!=""){
        dismiss =
        <TooltipButton clickFunction ={GameStore.dismiss} text="Lieber nicht" icon="no"/>;
        hide = GameStore.dismiss;
      }
        return (
          <Modal show={GameStore.warningshow} onHide={hide}>
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body>{GameStore.alert}</Modal.Body>
            <Modal.Footer>
            {dismiss}
            <TooltipButton clickFunction ={GameStore.modalClose} text="Alright" icon="new"/>
            </Modal.Footer>
          </Modal>
        );
    }
}
