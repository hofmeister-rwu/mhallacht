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
import Card from 'react-bootstrap/Card';
import { observable, action } from 'mobx';

import TooltipButton from "../components/TooltipButton"
// import MobxInteraction from "../pages/MobxInteraction"


// Require scss files
require('../../stylesheets/_all.scss');

// require LESS files
require('../../stylesheets/initial.less');


@observer
export default class RoleModal extends React.Component {

  constructor(props){
    super(props);
  }
    render() {
      let use;
      let text;
      if(this.props.roleFunction!=undefined){
        use = <TooltipButton clickFunction ={()=>{this.props.dismiss(); this.props.roleFunction();}} text="Alright" icon="new"/>;
        text = "Rolle einsetzen?";
      }
        return (
          <Modal show={this.props.show} onHide={this.props.dismiss}>
            <Modal.Header closeButton>
            </Modal.Header>
            <Card className={"roleCard modalRoleCard value-"+this.props.playerRole}>
              <Card.Body>
                <div class="card-front">
                  <p> {this.props.playerRole}</p>
                </div>
                <div class="card-back">
                  <p> Back </p>
                </div>
              </Card.Body>
            </Card>
            <Modal.Body>{text}</Modal.Body>
            <Modal.Footer>
            <TooltipButton clickFunction ={this.props.dismiss} text="Lieber nicht" icon="no"/>
            {use}
            </Modal.Footer>
          </Modal>
        );
    }
}
