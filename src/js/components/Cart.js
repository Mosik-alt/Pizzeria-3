import { select, classNames, settings, templates } from '../settings.js';
import CartProduct from './CartProduct.js';
import utils from '../utils.js';

class Cart {

  constructor(element) {
    const thisCart = this;
    thisCart.product = [];
    thisCart.deliveryFee = settings.cart.defaultDeliveryFee;

    thisCart.getElements(element);
    thisCart.initActions();

  }

  getElements(element) {
    const thisCart = this;
    thisCart.dom = {};
    thisCart.dom.wrapper = element;
    thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
    thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);
    thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
    thisCart.dom.address = thisCart.dom.wrapper.querySelector(select.cart.address);
    thisCart.dom.phone = thisCart.dom.wrapper.querySelector(select.cart.phone);
    thisCart.renderTotalsKeys = ['totalNumber', 'totalPrice', 'subtotalPrice', 'deliveryFee'];

    for (let key of thisCart.renderTotalsKeys) {
      thisCart.dom[key] = thisCart.dom.wrapper.querySelectorAll(select.cart[key]);
    }
  }

  initActions() {
    const thisCart = this;
    thisCart.dom.toggleTrigger.addEventListener('click', function (event) {
      event.preventDefault();
    });
    thisCart.dom.toggleTrigger.addEventListener('click', function () {
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
    });
    thisCart.dom.productList.addEventListener('updated', function () {
      thisCart.update();
    });
    thisCart.dom.form.addEventListener('submit', function () {
      event.preventDefault();
      thisCart.sendOrder();
    });
  }

  add(menuProduct) {
    const thisCart = this;
    /*generate HTML based on temple w scripcie o id="template-cart-product" przekazujemy cały obiekt menuProduct */
    const generatedHTML = templates.cartProduct(menuProduct);

    /*create element using utils.createElementFromHTML powyższy kod zamieniamy na elementy DOM */
    const generatedDOM = utils.createDOMFromHTML(generatedHTML);

    /*find cart container -  dodajemy te elementy do DOM*/
    const cartContainer = document.querySelector(thisCart.dom.productList);
    /*add element to menu*/
    cartContainer.appendChild(menuProduct);
    console.log('adding product', menuProduct);

    thisCart.product.push(new CartProduct(menuProduct, generatedDOM));
    console.log('thisCart', thisCart.products);
  }

  update() {
    const thisCart = this;
    thisCart.totalNumber = 0;
    thisCart.subtotalPrice = 0;

    for (let product of thisCart.products) {
      thisCart.subtotalPrice += product.price;
      thisCart.totalNumber += product.amount;
    }

    thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;

    for (let key of thisCart.renderTotalsKeys) {
      for (let elem of thisCart.dom[key]) {
        elem.innerHTML = thisCart[key];
      }
    }

  }

  remove(cartProduct) {
    const thisCart = this;
    /* stała index, której wartością jest index cartProduct w tablicy thisCart.products*/
    const index = thisCart.products.indexOf(cartProduct);
    /* użyć metody splice ( przymuje ona 2 argumenty:indeks pierwszego usuwanego elementu oraz liczbę elementów,
           licząc od pierwszego usuwanego elementu. )
           do usunięcia elementu  o tym indeksie z tablicy thisCart.products ?ale ile elementów usuwamy może 1 bo jest jeden element w tablicy??*/
    thisCart.products.splice(index, 1);
    /* usunąć z DOM element cartProduct.dom.wrapper- wpisać element DOM do usunięcia funkcję remove i pusty nawias*/
    cartProduct.dom.wrapper.remove();

    thisCart.update();
  }

  sendOrder() {
    const thisCart = this;
    /* w stałej dodajemy adres endpoitu  Order*/
    const url = settings.db.url + '/' + settings.db.order;
    /* deklaruję stałą ładunek - tzw dane z serwera*/
    const payload = {
      address: 'test',
      /*zapisuję wartości zaliczne do update - do aktualizacji danych w zamówieniu*/
      totalPrice: thisCart.totalPrice,
      totalNumber: thisCart.totalNumber,
      subtotalPrice: thisCart.subtotalPrice,
      deliveryFee: thisCart.deliveryFee,
      product: [],
    };

    /* dodaję pętlę iterującą po wszystkich thisCart.products,*/
    for (let product of thisCart.products) {
      /*i dla każdego produktu wywołam jego metodę getData*//*Wynik zwracany przez tą metodą dodaj do tablicy payload.products.*/
      payload.products.return(product.getData());

    }

    /*konfiguruję zapytanie tu jest POST czyli wysyłania danych do API*/
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    fetch(url, options)
      /* chainnig czyli łączenie kilku metod ze sobą za pomocą kropki*/
      .then(function (response) {
        /* otrzymaną odpowiedź konwertujemy z JSONa na tablicę*/
        return response.json();
      })
      .then(function (parsedResponse) {
        /* po otrzymaniu skorwentowanej odpowiedzi parsedResponse wyswietlamy w konsoli*/
        console.log('parsedResponse', parsedResponse);
      });

  }
}
export default Cart;