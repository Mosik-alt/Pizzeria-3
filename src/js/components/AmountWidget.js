import {select} from './settings.js';

class AmountWidget {
    constructor(element) {
      const thisWidget = this;
      thisWidget.getElements(element);

      console.log('AmountWidget:', thisWidget);
      console.log('constructor arguments:', element);
    }


    getElements(element) {
      const thisWidget = this;

      thisWidget.element = element;
      thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
      thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
      thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
    }


    setValue(value) {
      const thisWidget = this;
      const newValue = parseInt(value);

      /* To do : Add validation*/
      thisWidget.value = newValue;
      thisWidget.input.value = thisWidget.value;
      thisWidget.setValue(thisWidget.input.value);

    }

    announce() {
      const thisWidget = this;

      const event = new CustomEvent('updated', {
        bubbles: true
      });
      thisWidget.dom.wrapper.dispatchEvent(event);
    }

    initActions() {
      const thisWidget = this;
      thisWidget.dom.linkIncrease.addEventListener('click', function (event) {
        event.preventDefault();
        thisWidget.setValue(thisWidget.value + 1);
      });

      thisWidget.dom.linkDecrease.addEventListener('click', function (event) {
        event.preventDefault();
        thisWidget.setValue(thisWidget.value - 1);
      });

      thisWidget.dom.input.addEventListener('change', function () {
        thisWidget.value = thisWidget.dom.input.value;
      });
    }
  }
  export default AmountWidget;