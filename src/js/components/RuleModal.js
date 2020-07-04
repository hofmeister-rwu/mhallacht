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
// import MobxInteraction from "../pages/MobxInteraction"


// Require scss files
require('../../stylesheets/_all.scss');

// require LESS files
require('../../stylesheets/initial.less');


@observer
export default class RuleModal extends React.Component {

  constructor(props){
    super(props);
  }
    render() {
        return (
          <Modal show={GameStore.ruleshow} onHide={GameStore.setRuleShow.bind(false)} class="ruleModal">
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body>
              <h1> Spielregeln </h1>
              <p> Hallo Spieler! <br/>
              Bist du ein bisschen verwirrt wie alles funktioniert?
              Hier sind die Regeln:</p>
              <h2>Regeln</h2>
             <p>
                In diesem Spiel gibt es Monster- und Aktionskarten; diese haben einen Wert. Außerdem gibt es Charakterkarten, die auf einem anderen Stapel liegen und keinen Wert haben.
                Am Anfang des Spieles bekommt jeder Spieler 4 Karten vom Monster- und Aktionskartenstapel und eine Charakterkarte.
                Ziel des Spiels ist es, am Ende des Spiels so wenig Punkte wie möglich im eigenen Deck zu haben.
                Am Anfang kannst du deine 2 äußeren Karten anschauen. Deine Charakterkarte kannst du anschauen indem du  einmal darauf klickst.
             </p>
             <h3>Grundregeln</h3>
            <p>Es wird im Uhrzeiger gespielt. Jeder  Zug beginnt damit, dass der Spieler, der an der Reihe ist, die oberste Karte offen​ zieht, entweder vom verdeckten Stapel oder vom offenen Ablagestapel.
            Vom offenen Ablagestapel darf nur gezogen werden, wenn eine Monsterkarte oben liegt, Aktionskarten dürfen nicht vom Ablagestapel gezogen werden. Diese Karte darf der Spieler nun verwenden:
            </p>
            <ul>
              <li>
                ​Tauschen ​ : decke eine deiner 4 Spielerkarten auf, und lege die gezogene Karte verdeckt an deren Stelle. Die Spielerkarte wird nun entweder ​abgelegt ​oder ​eingesetzt, ​falls eine Aktionskarte aufgedeckt wurde.
              </li>
              <li>
                ​Einsetzen ​ : Handelt es sich bei der Karte um eine Aktionskarte (diese haben immer den Wert 10), kann diese verwendet werden: es darf also die Aktion durchgeführt werden, die auf der Karte beschrieben steht. Danach wird die Aktionskarte  auf den Ablagestapel gelegt.
              </li>
              <li>
                ​Ablegen ​ : Karten müssen weder eingesetzt noch eingetauscht werden, sie  dürfen auch direkt abgelegt werden.
              </li>
            </ul>
            <p>
            Beispiel: Simone zieht eine Karte vom verdeckten Stapel, und dreht diese offen um, sodass sie alle sehen können: es ist eine Monsterkarte mit dem Wert 2.
            Sie tauscht diese gegen eine Spielerkarte und sieht sich diese an: es handelt sich um die Aktionskarte  „Ansichtskarte”, die Simone gleich einsetzt.
            Sie sieht sich eine ihrer verdeckt vor ihr liegenden Karten an. Nun legt sie die Aktionskarte „Ansichtskarte“ auf den Ablagestapel und beendet ihren Zug.
            <br/><br/>
 
            Zusätzlich kann eine ​Fähigkeit ​ ausgeführt werden, die auf der Charakterkarte beschrieben ist. Steht nichts weiter auf der Charakterkarte,
            findet dies ​nach​ dem Ziehen einer Karte statt. Nicht alle Charakterfähigkeiten werden nur einmalig und nach dem Ziehen durchgeführt,
            einzelne werden beispielsweise anstatt eines normalen Zuges eingesetzt, was der jeweiligen Kartenbeschreibung zu entnehmen ist.
            Wurde ein Charakterkarte eingesetzt, die nur einmalig verwendbar ist (Auf der Karte steht unter Bedingung „einmalig verwendbar“), wird diese umgedreht.
            Sie ist ​inaktiv ​und kann nicht mehr verwendet werden.</p>

            <h3>Wertung und Spielende</h3>

            <p>
              Spielt ein Spieler die Stop-Karte aus, wird die Runde zu Ende gespielt (jeder kommt noch einmal dran).<br/>
              Danach kommt die Wertung: Die Karten werden offen gelegt (Achtung: es gibt einzelne Charakter die in der Wertung eingesetzt werden), und die Punkte zusammengerechnet (addiert) und aufgeschrieben.
            </p>

            <h3>
            Zusatzregeln
            </h3>
            <ol>
            <li>
               Wird eine Karte eingesetzt, egal ob Aktions- oder Charakterkarte, muss dies deutlich angesagt werden (Ausnahme sind Fähigkeiten die dauerhaft gelten), und Bedingungen müssen erklärt oder vorgelesen werden.
            </li>
            <li>
              Nicht eingesetzte Stop Karten werden auf einen kleinen Extra-Stapel gelegt, damit sie gezählt werden können. Sobald auf diesen die 5. Stop-Karten gelegt wird, wird das Spiel automatisch gestoppt.
            </li>
            <li>
              Der haarigste Spieler beginnt.
            </li>
            </ol>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={()=>{GameStore.setRuleShow(false)}}>
                Got It
              </Button>
            </Modal.Footer>
          </Modal>
        );
    }
}
