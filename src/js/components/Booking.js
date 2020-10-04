import { select, templates } from '../settings.js'
import AmountWidget from './AmountWidget.js';

export default class Booking {
    /*musi zawierać konstruktor i metody render oraz initWidgets, w których zapisujemy stałą thisBooking i zapisujemy w niej obiekt this*/
    constructor(element) {
        const thisBooking = this;
        /*metoda render ma zwracać argument z app.initBooking */
        thisBooking.render(element);
        thisBooking.initWidgets();
    }

    render(element) {
        const thisBooking = this;
        /* jak w menuProdukt*/
        const generatedHTML = templates.bookingWidget;
        /*stworzyć pusty obiekt thisBooking.dom*/
        thisBooking.dom = {};
        /*zapisywać do tego obiektu właściwość wrapper równą otrzymanemu argumentowi */
        thisBooking.dom.wrapper = element;
        /*zawartość wrappera zamieniać na kod HTML wygenerowany z szablonu */
        thisBooking.dom.wrapper.innerHTML = generatedHTML;
        /*we właściwości thisBooking.dom.peopleAmount zapisywać pojedynczy element znaleziony we wrapperze i pasujący do selektora select.booking.peopleAmount*/
        thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
        /*analogicznie do peopleAmount znaleźć i zapisać element dla hoursAmount */
        thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
        thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);
    }

    initWidgets() {
        const thisBooking = this
        /* Metoda ta we właściwościach thisBooking.peopleAmount i thisBooking.hoursAmount 
        zapisywać nowe instancje klasy AmountWidget, którym jako argument przekazujemy
         odpowiednie właściwości z obiektu thisBooking.dom*/
        thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
        thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
        /*Następnie w metodzie initWidgets stwórz nową instancję klasy DatePicker
         zapisując ją do właściwości thisBooking.datePicker, analogicznie jak zrobiliśmy
         to dla obu instancji AmountWidget.*/
         thisBooking.datePicker = new AmountWidget(thisBooking.dom.datePicker);
    }

}
