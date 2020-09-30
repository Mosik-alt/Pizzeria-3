import { render } from "node-sass";

export default class Booking {
    constructor(element) {
        const thisBooking = this;
        /*musi zawierać konstruktor i metody render oraz initWidgets, w których zapisujemy stałą thisBooking i zapisujemy w niej obiekt this*/
        thisBooking.render();
        thisBooking.initWidgets();
    }
}