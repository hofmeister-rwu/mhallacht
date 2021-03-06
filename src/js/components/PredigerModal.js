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
import GameStore from "../stores/gameStore"
import TooltipButton from '../components/TooltipButton'
import { observable, action } from 'mobx';
// import MobxInteraction from "../pages/MobxInteraction"


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
export default class PredigerModal extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      userAnswer: [],
    };
  }
    render() {
      var rightAnswer;
      if(CardStore.predigerVictim.playerCards !=undefined){
        rightAnswer=[];
        for (let i = 0; i < CardStore.predigerVictim.playerCards.length; i++) {
          if(CardStore.predigerCards.includes(CardStore.predigerVictim.playerCards[i])){
            rightAnswer.push(CardStore.predigerVictim.playerCards[i].value.toString());
          }
        }
      }
      let cards;
      if(CardStore.predigerVictim.playerCards != undefined){
        cards= <PlayerCards player={CardStore.predigerVictim} cardClick={()=>{}} end={false} roleCard={false} roleFunction={()=>{}}/>;
      }
      let userAnswer = [...this.state.userAnswer];
        return (
          <Modal show={GameStore.predigershow} className="prediger-modal" onHide={GameStore.setPredigerShow.bind(false)}>
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body>
            {cards}
            <div class="row">
              <div class="col-md-6">
                <h3> Linke Karte: </h3>
                  <Form key="card-one">
                    <div className="mb-3">
                      <Form.Check custom inline name="card-one" label="Tausch"type='radio' id={`card-one-swap`} onClick={changeUserAnswer.bind(this,0,"swap")}/>
                      <Form.Check custom inline name="card-one" label="Ansicht" type='radio' id={`card-one-show`}  onClick={changeUserAnswer.bind(this,0,"show")}/>
                      <Form.Check custom inline name="card-one" label="Überspringen" type='radio' id={`card-one-skip`} onClick={changeUserAnswer.bind(this,0,"skip")}/>
                      <Form.Check custom inline name="card-one" label="Ende" type='radio' id={`card-one-end`} onClick={changeUserAnswer.bind(this,0,"end")}/>
                      <Form.Check custom inline name="card-one" label="Doppelt" type='radio' id={`card-one-double`} onClick={changeUserAnswer.bind(this,0,"double")}/>
                      <Form.Check custom inline name="card-one" label="0" type='radio' id={`card-one-0`} onClick={changeUserAnswer.bind(this,0,"0")}/>
                      <Form.Check custom inline name="card-one" label="1" type='radio' id={`card-one-1`} onClick={changeUserAnswer.bind(this,0,"1")}/>
                      <Form.Check custom inline name="card-one" label="2" type='radio' id={`card-one-2`} onClick={changeUserAnswer.bind(this,0,"2")}/>
                      <Form.Check custom inline name="card-one" label="3" type='radio' id={`card-one-3`} onClick={changeUserAnswer.bind(this,0,"3")}/>
                      <Form.Check custom inline name="card-one" label="4" type='radio' id={`card-one-4`} onClick={changeUserAnswer.bind(this,0,"4")}/>
                      <Form.Check custom inline name="card-one" label="5" type='radio' id={`card-one-5`} onClick={changeUserAnswer.bind(this,0,"5")}/>
                      <Form.Check custom inline name="card-one" label="6" type='radio' id={`card-one-6`} onClick={changeUserAnswer.bind(this,0,"6")}/>
                      <Form.Check custom inline name="card-one" label="7" type='radio' id={`card-one-7`} onClick={changeUserAnswer.bind(this,0,"7")}/>
                      <Form.Check custom inline name="card-one" label="8" type='radio' id={`card-one-8`} onClick={changeUserAnswer.bind(this,0,"8")}/>
                      <Form.Check custom inline name="card-one" label="9" type='radio' id={`card-one-9`} onClick={changeUserAnswer.bind(this,0,"9")}/>
                    </div>
                  </Form>
              </div>
              <div class="col-md-6">
                  <h3> Rechte Karte: </h3>
                    <Form key="card-two">
                      <div className="mb-3">
                        <Form.Check custom inline name="card-two" label="Tausch" type='radio' id={`card-two-swap`} onClick={changeUserAnswer.bind(this,1,"swap")}/>
                        <Form.Check custom inline name="card-two" label="Ansicht" type='radio' id={`card-two-show`}  onClick={changeUserAnswer.bind(this,1,"show")}/>
                        <Form.Check custom inline name="card-two" label="Überspringen" type='radio' id={`card-two-skip`} onClick={changeUserAnswer.bind(this,1,"skip")}/>
                        <Form.Check custom inline name="card-two" label="Ende" type='radio' id={`card-two-end`} onClick={changeUserAnswer.bind(this,1,"end")}/>
                        <Form.Check custom inline name="card-two" label="Doppelt" type='radio' id={`card-two-double`} onClick={changeUserAnswer.bind(this,1,"double")}/>
                        <Form.Check custom inline name="card-two" label="0" type='radio' id={`card-two-0`} onClick={changeUserAnswer.bind(this,1,"0")}/>
                        <Form.Check custom inline name="card-two" label="1" type='radio' id={`card-two-1`} onClick={changeUserAnswer.bind(this,1,"1")}/>
                        <Form.Check custom inline name="card-two" label="2" type='radio' id={`card-two-2`} onClick={changeUserAnswer.bind(this,1,"2")}/>
                        <Form.Check custom inline name="card-two" label="3" type='radio' id={`card-two-3`} onClick={changeUserAnswer.bind(this,1,"3")}/>
                        <Form.Check custom inline name="card-two" label="4" type='radio' id={`card-two-4`} onClick={changeUserAnswer.bind(this,1,"4")}/>
                        <Form.Check custom inline name="card-two" label="5" type='radio' id={`card-two-5`} onClick={changeUserAnswer.bind(this,1,"5")}/>
                        <Form.Check custom inline name="card-two" label="6" type='radio' id={`card-two-6`} onClick={changeUserAnswer.bind(this,1,"6")}/>
                        <Form.Check custom inline name="card-two" label="7" type='radio' id={`card-two-7`} onClick={changeUserAnswer.bind(this,1,"7")}/>
                        <Form.Check custom inline name="card-two" label="8" type='radio' id={`card-two-8`} onClick={changeUserAnswer.bind(this,1,"8")}/>
                        <Form.Check custom inline name="card-two" label="9" type='radio' id={`card-two-9`} onClick={changeUserAnswer.bind(this,1,"9")}/>
                      </div>
                    </Form>
              </div>
            </div>
            </Modal.Body>
            <Modal.Footer>
            <TooltipButton clickFunction ={()=>{GameStore.predigerCheck(rightAnswer,userAnswer)}} text="Antwort bestätigen" icon="new"/>
            </Modal.Footer>
          </Modal>
        );
    }
}
