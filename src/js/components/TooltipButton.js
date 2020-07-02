import React, {Component} from 'react';
import CardStore from "../stores/cardStore";
import Game from "../components/Game"
import Overlay from 'react-bootstrap/Overlay'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import Button from 'react-bootstrap/Button'

class TooltipButton extends React.Component{
    render() {
      let img;
      switch(this.props.icon){
        case "draw":
          img = <img src={require("../public/static/draw.png")}/>;
          break;
        case "used":
          img = <img src={require("../public/static/used.png")}/>;
          break;
        case "skip":
          img = <img src={require("../public/static/skip.png")}/>;
          break;
        case "swap":
          img = <img src={require("../public/static/swap.png")}/>;
          break;
        case "show":
          img = <img src={require("../public/static/show.png")}/>;
          break;
        case "end":
          img = <img src={require("../public/static/end.png")}/>;
          break;
        case "double":
          img = <img src={require("../public/static/double.png")}/>;
          break;
        case "rule":
          img = <img src={require("../public/static/rule.png")}/>;
          break;
        case "save":
          img = <img src={require("../public/static/save.png")}/>;
          break;
        case "new":
          img = <img src={require("../public/static/new.png")}/>;
          break;
        case "load":
          img = <img src={require("../public/static/load.png")}/>;
          break;
        case "throw":
          img = <img src={require("../public/static/throw.png")}/>;
          break;
        case "end-turn":
          img = <img src={require("../public/static/end-turn.png")}/>;
          break;
        case "no":
          img = <img src={require("../public/static/no.png")}/>;
          break;
        case "role-swap":
          img = <img src={require("../public/static/role-swap.png")}/>;
          break;
        default:
          img = <img/>;
          break;
      }

      let btnClass;
      if(this.props.jumping == true){
        btnClass = "jumping";
      }

        return (

            <OverlayTrigger
                          placement="top"
                          //delay={{ show: 250, hide: 400 }}
                          overlay={(props) => (
                            <Tooltip id="overlay-example" {...props}>
                              {this.props.text}
                            </Tooltip>
                          )}
                        >
                          <Button class={btnClass} variant="purple" onClick={this.props.clickFunction} disabled={this.props.disabled} type={this.props.type}>
                          {img}
                          </Button>
          </OverlayTrigger>
        );
    }
}
export default TooltipButton;
