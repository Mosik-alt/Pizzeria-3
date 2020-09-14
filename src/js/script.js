/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

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
        for (let param in thisProduct.data.params) {
          // stała ma wartość wszystkich wybranych dodatków wykorzystujemy tablicę po wszystkich dodatkach "params"//
          const paramValue = thisProduct.data.params[paramId];
          /* START LOOP: for each optionId in param.options */
          //gdzie jest optionID? //
          for (let option in paramValue.options) {
            /* save the element in param.options with key optionId as const option */
            const optionValue = paramValue.options[optionId];
            /* START IF: if option is selected and option is not default */
            let formDataParam = formData[paramId] || [];
            if (formDataParam) {
              if (formDataParam.includes(option) && !optionValue.default) {
                /* add price of option to variable price */
                price += optionValue.price;
                /* END IF: if option is selected and option is not default */
                if (!formData.includes(option)) {
                  price -= optionValue.price;
                }
              }
              /* kod odpowiedzialny za obrazki, zaś formData powinna nam zwrócić zaznaczone opcje*/
              if (formDataParam && formDataParam.includes(option)) {
                if (!thisProduct.params[paramId]) {
                  thisProduct.params[paramId] = {
                    label: paramValue.label,
                    options: {},
                  };
                  console.log('thisProduct.params', thisProduct.params);
                }

                /*Wszystkie obrazki dla tej opcji, to wszystkie elementy wyszukane w thisProduct.imageWrapper, które pasują do selektora, składającego się z:*/
                thisProduct.params[paramId].options[optionId] = optionValue.label;
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
      thisProductamount = thisProduct.amountWidget.value;
      app.cart.app(thisProduct);

    }
  }

  class amountWidget {
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
      console.log('new Cart', thisCart);
    }
    getElements(element) {
      const thisCart = this;
      thisCard.dom = {};
      thisCart.dom.wrapper = element;
      thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
      thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);
    }


    initActions() {
      const thisCart = this;
      thisCart.dom.toggleTrigger.addEventListener('click', function (event) {
        event.preventDefault();
      });
      thisCart.dom.toggleTrigger.addEventListener('click', function () {
        thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
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

      thisCart.product.push(menuProduct);
      console.log('thisCart', thisCart.products);
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
      thisApp.data = dataSource;
    },

    initMenu: function () {
      const thisApp = this;
      console.log('thisApp.data:', thisApp.data);

      for (let productData in thisApp.data.products) {
        new Product(productData, thisApp.data.products[productData]);
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
      thisApp.initMenu();
      thisApp.initCart();

    },
  };

  app.init();
};