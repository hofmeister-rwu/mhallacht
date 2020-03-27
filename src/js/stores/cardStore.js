import { observable, action } from 'mobx';
import config from "../../config/main.config";



class CardStore {
    @observable chosenCard = { };
    @action selectCard(card) {
        this.chosenCard = card;
        console.log(this.chosenCard);
    };

}
const store = new CardStore();

export default store;
