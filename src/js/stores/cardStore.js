import { observable, action } from 'mobx';
import config from "../../config/main.config";
import { observer } from "mobx-react";



class CardStore {
    @observable chosenCard;
    @action.bound selectCard(card) {
      if(this.chosenCard != card){
        this.chosenCard = card;
      }else{
        this.chosenCard= undefined;
      }
    };
    @observable enemyCard;
    @action.bound selectEnemyCard(card) {
      if(this.enemyCard!=card){
          this.enemyCard = card;
      }else{
        this.enemyCard=undefined;
      }
    };
    @observable stackCard;
    @action.bound selectStackCard(card) {
        this.stackCard = card;
    };
    @observable showCard;
    @action.bound selectShowCard(card) {
        this.showCard = card;
    };
    @action.bound unselectCards() {
        this.chosenCard = undefined;
        this.enemyCard=undefined;
        this.showCard=undefined;
        this.stackCard=undefined;
    };
}
const store = new CardStore();

export default store;
