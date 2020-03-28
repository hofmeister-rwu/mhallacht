import { observable, action } from 'mobx';
import config from "../../config/main.config";
import { observer } from "mobx-react";



class CardStore {
    @observable chosenCard;
    @observable enemyCard;
    @action.bound selectCard(card) {
        this.chosenCard = card;
    };
    @action.bound unselectCard() {
        this.chosenCard = undefined;
    };
}
const store = new CardStore();

export default store;
