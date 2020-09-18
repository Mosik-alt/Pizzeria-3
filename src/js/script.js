/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

const { get } = require("browser-sync");

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
      cartProduct: '#template-cart-product', // CODE ADDED
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input.amount', // CODE CHANGED
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
    // CODE ADDED START
    cart: {
      productList: '.cart__order-summary',
      toggleTrigger: '.cart__summary',
      totalNumber: `.cart__total-number`,
      totalPrice: '.cart__total-price strong, .cart__order-total .cart__order-price-sum strong',
      subtotalPrice: '.cart__order-subtotal .cart__order-price-sum strong',
      deliveryFee: '.cart__order-delivery .cart__order-price-sum strong',
      form: '.cart__order',
      formSubmit: '.cart__order [type="submit"]',
      phone: '[name="phone"]',
      address: '[name="address"]',
    },
    cartProduct: {
      amountWidget: '.widget-amount',
      price: '.cart__product-price',
      edit: '[href="#edit"]',
      remove: '[href="#remove"]',
    },
    // CODE ADDED END
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
    // CODE ADDED START
    cart: {
      wrapperActive: 'active',
    },
    // CODE ADDED END
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }, // CODE CHANGED
    // CODE ADDED START
    cart: {
      defaultDeliveryFee: 20,
    },
    // CODE ADDED END
    db: {
      url: '//localhost:3131',
      product: 'product',
      order: 'order',
    },
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
    // CODE ADDED START
    cartProduct: Handlebars.compile(document.querySelector(select.templateOf.cartProduct).innerHTML),
    // CODE ADDED END
  };

  class Product {
    constructor(id, data) {
      const thisProduct = this;

      thisProduct.id = id;
      thisProduct.data = data;

      thisProduct.renderInMenu();
      thisProduct.getElements();
      thisProduct.initAccordion();
      thisProduct.initOrderForm();
      thisProduct.initAmountWidget();
      thisProduct.processOrder();


      console.log('new Product:', thisProduct);
    }

    renderInMenu() {
      const thisProduct = this;
      /*generate HTML based on temple* w HTML */
      const generatedHTML = templates.menuProduct(thisProduct.data);

      /*create element using utils.createElementFromHTML*/
      thisProduct.element = utils.createDOMFromHTML(generatedHTML);

      /*find menu container*/
      const menuContainer = document.querySelector(select.containerOf.menu);
      /*add element to menu*/
      menuContainer.appendChild(thisProduct.element);

    }

    getElements() {
      const thisProduct = this;

      thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
      thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
      thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
      thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
      thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
    }

    initAccordion() {
      const thisProduct = this;

      /*find the clickable trigger (element that should react to clicking)*/
      const clickableTigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      console.log('wyszukany element'),
        /*START : click event listener to trigger*/
        clickableTigger.addEventListener('click', function (event) {
          /*prevent default action for event*/
          event.preventDefault();
          /* toggle active class on element of thisProduct */
          thisProduct.element.classList.toggle('active');
          /* find all active products */
          const allActiveProducts = document.querySelectorAll('.product.active');
          /* START LOOP: for each active product */
          for (let activeProduct of allActiveProducts) {
            /* START: if the active product isn't the element of thisProduct */
            if (thisProduct.element != activeProduct) {
              /* remove class active for the active product */
              activeProduct.classList.remove('active');
              /* END: if the active product isn't the element of thisProduct */
            }
            /* END LOOP: for each active product */
          }
          /* END: click event listener to trigger */
        });
    }

    initOrderForm() {
      const thisProduct = this;
      console.log('initOrderForm');
      thisProduct.form.addEventListener('submit', function (event) {
        event.preventDefault();
        thisProduct.processOrder();
      });

      for (let input of thisProduct.formInputs) {
        input.addEventListener('change', function () {
          thisProduct.processOrder();
        });
      }

      thisProduct.cartButton.addEventListener('click', function (event) {
        event.preventDefault();
        thisProduct.processOrder();
        thisProduct.addTooCart();
      });
    }

    processOrder() {
      // this Product odnosi się do 4 instalacji o klasie Produkt jest ich 4 i przedstawia on każdą z osobna//
      const thisProduct = this;

      //wraca z formularza wartości name i value - wiemy jakie dodatki klient zamówił np do pizzy name o kluczu: toppings value: oliwki i salami//
      const formData = utils.serializeFormToObject(thisProduct.form);
      console.log('formData', formData);

      /* set variable price to equal thisProduct.data.price */
      // zmienna zapisuje domyślną cenę produktu, ale dlaczego 'data' a nie 'dataSource' z data.js?//
      thisProduct.params = {};
      let price = thisProduct.data.price;

      //START LOOP: for each paramId in thisProduct.data.params//
      //są również składniki odhaczone należy je znaleść po wszystkich params, ale gdzie jest checked? //
      if (thisProduct.data.params) {
        for (let paramId in thisProduct.data.params) {
          // stała ma wartość wszystkich wybranych dodatków wykorzystujemy tablicę po wszystkich dodatkach "params"//
          const paramValue = thisProduct.data.params[paramId];
          /* START LOOP: for each optionId in param.options */
          //gdzie jest optionID? //
          for (let optionId in paramValue.options) {
            /* save the element in param.options with key optionId as const option */
            const optionValue = paramValue.options[optionID];

            const optionSelected = formData.hasOwnProperty(paramId) && formData[paramId].indexOf(optionId) > -1;

            /* START IF: if option is selected and option is not default */
            if (optionSelected && !optionValue.default) {
              price += optionValue.price;
            } else if (!optionSelected && optionValue.default) {
              price -= optionValue.price;
            }
          }

          thisProduct.priceElem.innerHTML = price;

          /* kod odpowiedzialny za obrazki, zaś formData powinna nam zwrócić zaznaczone opcje*/
          if (formDataParam && formDataParam.includes(option)) {
            if (!thisProduct.params[param]) {
              thisProduct.params[param] = {
                label: paramValue.label,
                options: {},
              };
              console.log('thisProduct.params', thisProduct.params);
            }

            /*Wszystkie obrazki dla tej opcji, to wszystkie elementy wyszukane w thisProduct.imageWrapper, które pasują do selektora, składającego się z:*/
            thisProduct.params[param].options[option] = optionValue.label;
            let allImages = thisProduct.imageWrapper.querySelectorAll('.' + param + '-' + option);
            for (let image of allImages) {
              image.classList.add('active');
            }
          }
          else {
            let allImages = thisProduct.imageWrapper.querySelectorAll('.' + param + '-' + option);
            for (let image of allImages) {
              image.classList.remove('active');
            }
          }
        }
      }
    

  /* multiply price by amount */
  thisProduct.priceSingle = price;
  thisProduct.price = thisProduct.priceSingle * thisProduct.amountWidget.value;

  /* set the contents of thisProduct.priceElem to be the value of variable price */
  thisProduct.priceElem.innerHTML = thisProduct.price;
  }


initAmountWidget() {
  const thisProduct = this;
  thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
  thisProduct.amountWidgetElem.addEventListener('updated', function () {
    thisProduct.processOrder();
  });
}

addTooCart() {
  const thisProduct = this;
  thisProduct.name = thisProduct.data.name;
  thisProduct.amount = thisProduct.amountWidget.value;
  app.cart.add(thisProduct);

}
  }

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

class Cart {
  constructor(element) {
    const thisCart = this;
    thisCart.product = [];
    thisCart.deliveryFee = settings.cart.defaultDeliveryFee;
    console.log('new Cart', thisCart);
  }
  getElements(element) {
    const thisCart = this;
    thisCart.dom = {};
    thisCart.dom.wrapper = element;
    thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
    thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);

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

    console.log(totalNumber);
    console.log(subtotalPrice);
    console.log(thisCart.totalPrice);

    for (let key of thisCart.renderTotalsKeys) {
      for (let elem of thisCart.dom[key]) {
        elem.innerHTML = thisCart[key];
      }
    }

  }
  remove() {
    const thisCart = this;
    /* stała index, której wartością jest index cartProduct w tablicy thisCart.products*/
    const index = thisProduct.prducts.indexOf(cartProduct);
    /* użyć metody splice ( przymuje ona 2 argumenty:indeks pierwszego usuwanego elementu oraz liczbę elementów,
     licząc od pierwszego usuwanego elementu. )
     do usunięcia elementu  o tym indeksie z tablicy thisCart.products ?ale ile elementów usuwamy może 1 bo jest jeden element w tablicy??*/
    thisCart.products.splice(index, 1);
    /* usunąć z DOM element cartProduct.dom.wrapper- wpisać element DOM do usunięcia funkcję remove i pusty nawias*/
    thisCart.cartProduct.dom.wrapper.remove();
    thisCart.update();
  }

}


/* gdzie znajdę menuProduct - select.menuProduct w zmiennej globalnej*/
class CartProduct {
  constructor(menuProduct, element) {
    thisCartProduct = this;
    thisCartProduct.id = menuProduct.id;
    thisCartProduct.menu = menuProduct.menu;
    thisCartProduct.price = menuProduct.price;
    thisCartProduct.priceSingle = menuProduct.priceSingle;
    thisCartProduct.amount = menuProduct.amount;
    thisCartProduct.params = JSON.parse(JSON.stringify(menuProduct.params));
  }

  getElements(element) {

    console.log('thisCartProduct', thisCartProduct);
    const thisCartProduct = this;

    thisCartProduct.dom = {};

    thisCartProduct.dom.wrapper = element;
    /*przypisać znalezione we wrapperze właściwości - można je znaleść w select.cartProduct JS*/
    thisCartProduct.dom.amountWidget = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.amountWidget);
    thisCartProduct.dom.price = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.price);
    thisCartProduct.dom.edit = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.edit);
    thisCartProduct.dom.remove = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.remove);
  }

  initAmountWidget() {
    const thisCartProduct = this;

    thisCartProduct.amountWidget = new AmountWidget(thisCartProduct.dom.amountWidgetElem);
    thisCartProduct.amountWidgetElem.addEventListener('updated', function () {
      thisCartProduct.amount = thisCartProduct.amountWidget.value;
      thisCartProduct.price = thisCartProduct.priceSingle * thisCartProduct.amount;
      thisCartProduct.dom.price.innerHTML = thisCartProduct.price;
    });
  }

  initAmountWidget() {
    console.log('initAmountWidget', initAmuontWidget);
  }

  remove() {
    const thisCartProduct = this;

    const event = new CustomEvent('remove', {
      bubbles: true,
      detail: {
        cartProduct: thisCartProduct,
      }
    });
    thisCartProduct.dom.wrapper.dispatchEvent(event);
  }

  initActions() {
    const thisCart = this;
    /*? Dlaczego mi event sam się przekreśla?*/
    thisCartProduct.dom.edit.addEventListener('click', function () {
      event.preventDefault();
    });
    thisCartProduct.dom.remove.addEventListener('click', function () {
      event.preventDefault();
      thisCartProduct.remove();
    });
  }
}


const app = {

  initCart: function () {
    const thisApp = this;
    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);
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
};