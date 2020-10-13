import { select, settings } from '../settings.js';
import BaseWidget from './BaseWidget.js';
import utils from '../utils.js';


class HourPicker extends BaseWidget {
  constructor(wrapper) {
    super(wrapper, settings.hours.open);

    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.input);
    thisWidget.dom.output = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.output);
    thisWidget.initPlugin();
    thisWidget.value = thisWidget.dom.input.value;

  }

  initPlugin() {
    const thisWidget = this;
    // eslint-disable-next-line no-undef
    rangeSlider.create(thisWidget.dom.input);
    /* W handlerze tego eventu przypisz wartości widgetu (thisWidget.value) wartość tego elementu*/
    thisWidget.dom.input.addEventListener('input', function () {
      thisWidget.value = thisWidget.dom.input.value;
    });
  }

  /*Metoda parseValue ma przekazywać otrzymaną wartość do funkcji utils.numberToHour i zwracać wartość otrzymaną z tej funkcji*/
  pareseValue(value) {
    return utils.numberToHour(value);
  }

  isValid() {
    return (true);
  }

  /*Metoda renderValue ma zamieniać zawartość elementu thisWidget.dom.output na wartość widgetu*/
  renderValue() {
    const thisWidget = this;

    thisWidget.dom.output.innerHTML = thisWidget;
  }
}
export default HourPicker;