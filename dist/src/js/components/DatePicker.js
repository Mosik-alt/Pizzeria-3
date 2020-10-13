import {select, settings} from '../settings.js';
import BaseWidget from './BaseWidget.js';
import utils from '../utils.js';



class DatePicker extends BaseWidget {
  constructor(wrapper) {
    super(wrapper, utils.dateToStr(new Date()));
    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.datePicker.input);


    thisWidget.initPlugin();
  }

  initPlugin() {
    const thisWidget = this;

    /*  ma tworzyć właściwość thisWidget.minDate, której wartość będzie równa new Date(thisWidget.value)*/
    /*new Data tworzy nowy obiekt o wartości "teraz"*/
    thisWidget.minDate = new Date(thisWidget.value);

    /*ma tworzyć właściwość thisWidget.maxDate, która ma być datą późniejszą od thisWidget.minDate o ilość dni zdefiniowaną w settings.datePicker.maxDaysInFuture*/
    /*aby uzyskać datę przesuniętą o ileś dni, możesz używać przygotowanej przez nas funkcji utils.addDays*/
    thisWidget.maxDate = utils.addDays(thisWidget.minDate, settings.datePicker.maxDaysInFuture);

    flatpickr(thisWidget.dom.input, {
      defaultDate: thisWidget.minDate,
      minDate: thisWidget.minDate,
      maxDate: thisWidget.maxDate,

      'disable': [
        function (date) {
          return (date.getDay() === 1); //retun true to disable Monday
        }
      ],
      'locale': {
        'firstDayOfWeek': 1 // start week on Monday
      },

      onChange: function (selectedDates, dateStr) {
        thisWidget.value = dateStr;
      }
    });
  }
  pareseValue(value) {
    return parseInt(value);
  }

  isValid() {
    return (true);
  }

  renderValue() {
  }

}
export default DatePicker;