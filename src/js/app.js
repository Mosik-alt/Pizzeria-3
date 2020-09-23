import {settings, select} from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';

  
  const app = {

    initCart: function () {
      const thisApp = this;
      const cartElem = document.querySelector(select.containerOf.cart);
      thisApp.cart = new Cart(cartElem);

      thisApp.productList = document.querySelector(select.containerOf.menu);

      thisApp.productList.addEventListener('add-to-cart', function(event){
        app.cart.add(event.detail.product);
      });
    },

    initData: function () {
      const thisApp = this;
      thisApp.data = {};
      /*zapisujemy w stałej url adres endpointuz ktorego maja zostać pobrane dane */
      const url = settings.db.url + '/' + settings.db.product;
      /* wywołanie zapytania AJAX za pomocą funkcji fetch z zastosowaniem metody .then*/
      fetch(url)
      /* chainnig czyli łączenie kilku metod ze sobą za pomocą kropki*/
        .then(function (rawResponse) {
          /* otrzymaną odpowiedź konwertujemy z JSONa na tablicę*/
          return rawResponse.json();
        })
        .then(function (parsedResponse) {
          /* po otrzymaniu skorwentowanej odpowiedzi parsedResponse wyswietlamy w konsoli*/
          console.log('parsedResponse', parsedResponse);
          /* save parsedResponse as thisApp.data.products*/
          thisApp.data.products = parsedResponse;
          /* execute initMenu method*/
          thisApp.initMenu();
        });
      console.log('thisApp.data', JSON.stringify(thisApp.data));
    },

    initMenu: function () {
      const thisApp = this;
      console.log('thisApp.data:', thisApp.data);

      for (let productData in thisApp.data.products) {
        new Product(thisApp.data.products[productData].id, thisApp.dataaproducts[productData]);
      }
    },

    init: function () {
      const thisApp = this;
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);

      thisApp.initData();

      thisApp.initCart();

    },
  };

  app.init();
