import { LightningElement } from 'lwc';

export default class ButtonIconStatefulVariants extends LightningElement {
    likeStateInverse = false;
    answerStateInverse = false;
    likeStateFilled = false;
    answerStateFilled = false;

    handleLikeButtonInverseClick() {
        this.likeStateInverse = !this.likeStateInverse;
    }

    handleAnswerButtonInverseClick() {
        this.answerStateInverse = !this.answerStateInverse;
    }

    handleLikeButtonFilledClick() {
        this.likeStateFilled = !this.likeStateFilled;
    }

    handleAnswerButtonFilledClick() {
        this.answerStateFilled = !this.answerStateFilled;
    }
}
