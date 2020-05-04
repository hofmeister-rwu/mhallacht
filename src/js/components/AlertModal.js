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
export default class AlertModal extends React.Component {

  constructor(props){
    super(props);
  }
    render() {
        return (
          <Modal show={this.props.show} onHide={this.props.onHide}>
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body><Alert variant="warning">{this.props.alert}</Alert></Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.props.onHide}>
                Got It
              </Button>
            </Modal.Footer>
          </Modal>
        );
    }
}
