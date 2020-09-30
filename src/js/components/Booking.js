import { select, templates } from '../settings.js'
import AmountWidget from './AmountWidget.js';

export class Booking {
    /*musi zawierać konstruktor i metody render oraz initWidgets, w których zapisujemy stałą thisBooking i zapisujemy w niej obiekt this*/
    constructor(element) {
        const thisBooking = this;
        /*metoda render ma zwracać argument z app.initBooking */
        thisBooking.render(app.initBooking);
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
        thisBooking.dom.hoursAmount = thisBooking.dom.querySelector(select.booking.hoursAmount);
    }

    initWidgets() {
        const thisBooking = this
        /* Metoda ta we właściwościach thisBooking.peopleAmount i thisBooking.hoursAmount 
        zapisywać nowe instancje klasy AmountWidget, którym jako argument przekazujemy
         odpowiednie właściwości z obiektu thisBooking.dom*/
        thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
        thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    }

}
