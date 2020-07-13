import React from "react"
import { HashRouter, Route } from 'react-router-dom';
import { observer } from "mobx-react";
import Modal from 'react-bootstrap/Modal'
import ModalHeader from 'react-bootstrap/ModalHeader'
import ModalTitle from 'react-bootstrap/ModalTitle'
import ModalBody from 'react-bootstrap/ModalBody'
import ModalFooter from 'react-bootstrap/ModalFooter'

import GameStore from "../stores/gameStore"
import { observable, action } from 'mobx';

import TooltipButton from "../components/TooltipButton"
import Carousel from 'react-bootstrap/Carousel'
// import MobxInteraction from "../pages/MobxInteraction"


// Require scss files
require('../../stylesheets/_all.scss');

// require LESS files
require('../../stylesheets/initial.less');


@observer
export default class TutorialModal extends React.Component {

  constructor(props){
    super(props);
  }
    render() {
        return (
          <Modal class="tutorial-modal" show={GameStore.tutorialShow} onHide={GameStore.setTutorialShow.bind(this,false)}>
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body>
              <Carousel interval={10000}>
                <Carousel.Item>
                <video autoPlay loop class="w-100 h-auto">
                  <source src={require("../public/static/anfangskarten.mp4")} type="video/mp4"/>
                  Your browser does not support the video tag.
                </video>
                <h3>Aufbau</h3>
                <p>
                  Jeder Spieler erhält 4 Karten, von denen die beiden Äußeren zu Beginn des Spiels angeschaut werden dürfen. Das sind die Wertkarten.
                  Außerdem erhält jeder Spieler eine Rollenkarte.
                </p>
                </Carousel.Item>
                  <Carousel.Item>
                  <video autoPlay loop class="w-100 h-auto">
                    <source src={require("../public/static/winning-cards.mp4")} type="video/mp4"/>
                    Your browser does not support the video tag.
                  </video>
                  <h3>Ziel des Spiels</h3>
                  <p>
                    Ziel des Spiels ist es, den Gesamtwert der eigenen Karten so GERING wie möglich zu halten.
                  </p>
                  </Carousel.Item>
                <Carousel.Item>
                <img src={require("../public/static/monster-karten.png")}/>
                <h3>Monsterkarten</h3>
                <p>
                Monsterkarten haben einen Wert von 0 bis 9. Ziehst du eine Monsterkarte vom Kartenstapel kannst du sie mit einer von deinen Karten tauschen.
                </p>
                </Carousel.Item>

                <Carousel.Item>
                <img src={require("../public/static/aktionskarten.png")}/>
                <h3>Aktionskarten</h3>
                <p>
                Aktionskarten haben einen Wert von 10. Ziehst du eine Aktionskarte vom Kartenstapel oder deckst sie beim Tauschen auf, darfst du sie einsetzen (aber nicht tauschen).
                </p>
                </Carousel.Item>

                <Carousel.Item>
                <img src={require("../public/static/card-compilation.png")}/>
                <h3>Rollenkarten</h3>
                <p>
                Rollenkarten werden nicht gewertet. Jeder Spieler hat eine andere Rollen, die ihm eine Aktion ermöglicht, aber immer an eine Bedingung geknüpft ist.
                </p>
                </Carousel.Item>

                <Carousel.Item>
                <video autoPlay loop class="w-100 h-auto">
                  <source src={require("../public/static/spiel-interaktion.mp4")} type="video/mp4"/>
                  Your browser does not support the video tag.
                </video>
                <p>
                  Spiele, indem du auf Karten und auf Buttons klickst, um zu tauschen oder Karten einzusetzen.
                </p>
                </Carousel.Item>
              </Carousel>
            </Modal.Body>
            <Modal.Footer>
            <TooltipButton clickFunction ={GameStore.setTutorialShow.bind(this,false)} text="Überspringen" icon="new"/>
            </Modal.Footer>
          </Modal>
        );
    }
}
