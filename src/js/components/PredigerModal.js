import React from "react"
import { HashRouter, Route } from 'react-router-dom';
import { observer } from "mobx-react";
import Alert from 'react-bootstrap/Alert'
import Modal from 'react-bootstrap/Modal'
import ModalHeader from 'react-bootstrap/ModalHeader'
import ModalTitle from 'react-bootstrap/ModalTitle'
import ModalBody from 'react-bootstrap/ModalBody'
import ModalFooter from 'react-bootstrap/ModalFooter'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import PlayerCards from "../components/PlayerCards"
import StackCards from "../components/StackCards"
import CardStore from "../stores/cardStore"
import { observable, action } from 'mobx';
// import MobxInteraction from "../pages/MobxInteraction"


// Require scss files
require('../../stylesheets/_all.scss');

// require LESS files
require('../../stylesheets/initial.less');

function changeUserAnswer(index,value){
  if(this.state.userAnswer[index]!=undefined){
    const newAnswer = [...this.state.userAnswer];
    newAnswer[index] = value;
    this.setState({ userAnswer:newAnswer });
  }else{
    this.setState(state => {
        const userAnswer = state.userAnswer.concat(value);
        return {
          userAnswer
        };
      });
  }
}


@observer
export default class AlertModal extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      userAnswer: [],
    };
  }
    render() {
      let rightAnswer;
      for (let i = 0; i < CardStore.predigerVictim.length; i++) {
        if(CardStore.predigerCards.includes(CardStore.predigerVictim.playerCards[i])){
          rightAnswer.push(CardStore.predigerVictim.playerCards[i].value.toString);
        }
      }
        return (
          <Modal show={this.props.show} onHide={this.props.onHide}> 
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body>
              <PlayerCards player={CardStore.predigerVictim} cardClick={()=>{}} end={false} roleCard={false} roleFunction={()=>{}}/>
              <p> Erste Karte </p>
                <Form key="card-one">
                  <div className="mb-3">
                    <Form.Check inline name="card-one" label="Tausch"type='radio' id={`inline-radio-2`} onClick={changeUserAnswer.bind(this,0,"swap")}/>
                    <Form.Check inline name="card-one" label="Ansicht" type='radio' id={`inline-radio-3`}  onClick={changeUserAnswer.bind(this,0,"show")}/>
                    <Form.Check inline name="card-one" label="Überspringen" type='radio' id={`inline-radio-4`} onClick={changeUserAnswer.bind(this,0,"skip")}/>
                    <Form.Check inline name="card-one" label="Ende" type='radio' id={`inline-radio-5`} onClick={changeUserAnswer.bind(this,0,"end")}/>
                    <Form.Check inline name="card-one" label="Doppelt" type='radio' id={`inline-radio-6`} onClick={changeUserAnswer.bind(this,0,"double")}/>
                    <Form.Check inline name="card-one" label="0" type='radio' id={`inline-radio-6`} onClick={changeUserAnswer.bind(this,0,"0")}/>
                    <Form.Check inline name="card-one" label="1" type='radio' id={`inline-radio-6`} onClick={changeUserAnswer.bind(this,0,"1")}/>
                    <Form.Check inline name="card-one" label="2" type='radio' id={`inline-radio-6`} onClick={changeUserAnswer.bind(this,0,"2")}/>
                    <Form.Check inline name="card-one" label="3" type='radio' id={`inline-radio-6`} onClick={changeUserAnswer.bind(this,0,"3")}/>
                    <Form.Check inline name="card-one" label="4" type='radio' id={`inline-radio-6`} onClick={changeUserAnswer.bind(this,0,"4")}/>
                    <Form.Check inline name="card-one" label="5" type='radio' id={`inline-radio-6`} onClick={changeUserAnswer.bind(this,0,"5")}/>
                    <Form.Check inline name="card-one" label="6" type='radio' id={`inline-radio-6`} onClick={changeUserAnswer.bind(this,0,"6")}/>
                    <Form.Check inline name="card-one" label="7" type='radio' id={`inline-radio-6`} onClick={changeUserAnswer.bind(this,0,"7")}/>
                    <Form.Check inline name="card-one" label="8" type='radio' id={`inline-radio-6`} onClick={changeUserAnswer.bind(this,0,"8")}/>
                    <Form.Check inline name="card-one" label="9" type='radio' id={`inline-radio-6`} onClick={changeUserAnswer.bind(this,0,"9")}/>
                  </div>
                </Form>
                <p> Zweite Karte </p>
                  <Form key="card-two">
                    <div className="mb-3">
                      <Form.Check inline name="card-two" label="Tausch"type='radio' id={`inline-radio-2`} onClick={changeUserAnswer.bind(this,1,"swap")}/>
                      <Form.Check inline name="card-two" label="Ansicht" type='radio' id={`inline-radio-3`}  onClick={changeUserAnswer.bind(this,1,"show")}/>
                      <Form.Check inline name="card-two" label="Überspringen" type='radio' id={`inline-radio-4`} onClick={changeUserAnswer.bind(this,1,"skip")}/>
                      <Form.Check inline name="card-two" label="Ende" type='radio' id={`inline-radio-5`} onClick={changeUserAnswer.bind(this,1,"end")}/>
                      <Form.Check inline name="card-two" label="Doppelt" type='radio' id={`inline-radio-6`} onClick={changeUserAnswer.bind(this,1,"double")}/>
                      <Form.Check inline name="card-two" label="0" type='radio' id={`inline-radio-6`} onClick={changeUserAnswer.bind(this,1,"0")}/>
                      <Form.Check inline name="card-two" label="1" type='radio' id={`inline-radio-6`} onClick={changeUserAnswer.bind(this,1,"1")}/>
                      <Form.Check inline name="card-two" label="2" type='radio' id={`inline-radio-6`} onClick={changeUserAnswer.bind(this,1,"2")}/>
                      <Form.Check inline name="card-two" label="3" type='radio' id={`inline-radio-6`} onClick={changeUserAnswer.bind(this,1,"3")}/>
                      <Form.Check inline name="card-two" label="4" type='radio' id={`inline-radio-6`} onClick={changeUserAnswer.bind(this,1,"4")}/>
                      <Form.Check inline name="card-two" label="5" type='radio' id={`inline-radio-6`} onClick={changeUserAnswer.bind(this,1,"5")}/>
                      <Form.Check inline name="card-two" label="6" type='radio' id={`inline-radio-6`} onClick={changeUserAnswer.bind(this,1,"6")}/>
                      <Form.Check inline name="card-two" label="7" type='radio' id={`inline-radio-6`} onClick={changeUserAnswer.bind(this,1,"7")}/>
                      <Form.Check inline name="card-two" label="8" type='radio' id={`inline-radio-6`} onClick={changeUserAnswer.bind(this,1,"8")}/>
                      <Form.Check inline name="card-two" label="9" type='radio' id={`inline-radio-6`} onClick={changeUserAnswer.bind(this,1,"9")}/>
                    </div>
                  </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.props.compare.bind(this.state.userAnswer,rightAnswer)}>
                Fertig
              </Button>
            </Modal.Footer>
          </Modal>
        );
    }
}
