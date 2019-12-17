<template>
<div id="ordering">
  <button id='langButton' v-on:click='switchLang()'>
    <img id='langPic' v-on:click='switchFlag()' v-if='flag_en' src='@/assets/englishflag.jpg' width="30px" height="20px">
    <img id='langPic' v-on:click='switchFlag()' v-if='flag_sv' src='@/assets/swedishflag.jpg' width="30px" height="20px">
  </button>
  <div class="startpage-container">
    <div class='startpage'>
      <h1 id="startHead"> {{uiLabels.welcomeSite}} </h1>
    </div>
  </div>

  <div id="placeOrderBox">
    <div v-for="ingredCounter in countAllIngredients" v-if="ingredCounter.count>0" :key="countAllIngredients.indexOf(ingredCounter)">
      {{ingredCounter.name}}: {{ingredCounter.count}} {{uiLabels.parts}},
    </div>
    {{uiLabels.totalPrice}}: {{price}} kr
    <button id="placeOrderButton" type="button" v-on:click="placeOrderClick"> {{ uiLabels.placeOrder }} </button>
  </div>

  <modal name="payment">
    <form>
      <p><label for="firstname">Full name</label><br>
        <input type="text" id="fullname" name="fn" required="required" placeholder="First- and Last Name" size="30"></p>
      <p><label for="email">Email address</label><br>
        <input type="email" id="email" name="em" required="required" placeholder="Skurk.skurksson@skurson.com" size="30"></p>
      <p><label for="Street">Street name</label><br>
        <input type="text" id="streetname" name="sn" placeholder="Street name" size="30"></p>
      <p><label for="House">House number</label><br>
        <input type="number" id="House" name="Ho" placeholder="House number"></p>
      <p><label for="paymentmethod">Payment method</label><br>
        <select id="paymentmethod" name="pmmt">
          <option>Credit card</option>
          <option>Swish</option>
          <option>Invoice (Klarna)</option>
          <option>Cash on delivery</option>
        </select></p>
      <p id="gender">
        <label for="gender">Please select your gender:</label><br>
        <input type="radio" name="gender" value="Female"> Female<br>
        <input type="radio" name="gender" value="Male"> Male<br>
        <input type="radio" name="gender" value="Do not wish to provide"> Undisclosed<br>
      </p>
      <button id="placeOrderButton" type="button" v-on:click="placeOrder()"> {{ uiLabels.placeOrder }} </button>
    </form>
  </modal>
  <modal name="confirmation">
    <button id="placeOrderButtontwo" type="button" v-on:click="placeOrder()"> {{ uiLabels.placeOrder }} </button>
    Order confirmed
  </modal>



  <button id="backButtons" type="button" onclick="window.location = '/';"> {{uiLabels.goBack}} </button>

  <div class="all-ingredients">

    <div id="fixedCategoryTab">

      <div class="categoryList">
        <button v-on:click="changeCategory(1)"> {{uiLabels.categoryMeat}} </button>
        <button v-on:click="changeCategory(2)"> {{uiLabels.categorySides}}</button>
        <button v-on:click="changeCategory(3)"> {{uiLabels.categorySauce}} </button>
        <button v-on:click="changeCategory(4)"> {{uiLabels.categoryBread}}</button>
      </div>
    </div>


    <h1>{{ uiLabels.ingredients }}</h1>
    <div class="ingredient-container">
      <div v-for="item in ingredients" class="ingredient-box" v-if="item.category===currentCategory">
        <Ingredient ref="ingredient" v-on:increment="addToOrder(item)" v-on:decrease="reduceOrder(item)" :count="item.counter" :item="item" :categoryNumber="currentCategory"
          :lang="lang" :key="item.ingredient_id">
        </Ingredient>
      </div>
    </div>

  </div>


</div>
</template>
<script>
//import the components that are used in the template, the name that you
//use for importing will be used in the template above and also below in
//components
import Ingredient from '@/components/Ingredient.vue'
import OrderItem from '@/components/OrderItem.vue'

//import methods and data that are shared between ordering and kitchen views
import sharedVueStuff from '@/components/sharedVueStuff.js'

/* instead of defining a Vue instance, export default allows the only
necessary Vue instance (found in main.js) to import your data and methods */
export default {
  name: 'Ordering',
  components: {
    Ingredient,
    OrderItem
  },
  mixins: [sharedVueStuff],
  // include stuff that is used in both
  // the ordering system and the kitchen
  data: function() { //Not that data is a function!
    return {
      chosenIngredients: [],
      price: 0,
      orderNumber: "",
      currentCategory: 1,
      hamburgerButtons: false,
      displayOrder: false
    }
  },
  created: function() {
    this.$store.state.socket.on('orderNumber', function(data) {
      this.orderNumber = data;
    }.bind(this));
  },
  computed: {
    eatHome() {
      console.log(this.$route.query.eat === 'home')
      return this.$route.query.eat === 'home'
    },
    countAllIngredients: function() {
      let ingredientTuples = []
      for (let i = 0; i < this.chosenIngredients.length; i += 1) {
        ingredientTuples[i] = {};
        ingredientTuples[i].name = this.chosenIngredients[i]['ingredient_' + this.lang];
        ingredientTuples[i].count = this.countNumberOfIngredients(this.chosenIngredients[i].ingredient_id);
      }
      let allIngredients = Array.from(new Set(ingredientTuples.map(arrayName => arrayName.name))).map(name => {
        return {
          name: name,
          count: ingredientTuples.find(arrayName => arrayName.name === name).count
        };
      });
      return allIngredients;
    }
  },

  methods: {
    show (name) {
      this.$modal.show(name);
    },
    hide (name) {
      this.$modal.hide(name);
    },

    showBurger: function(boolean) {
      this.hamburgerButtons = boolean;
    },

    showOrder: function(boolean) {
      this.displayOrder = boolean;
    },

    changeCategory: function(int) {
      this.currentCategory = int;
    },

    addToOrder: function(item) {
      this.chosenIngredients.push(item);
      this.price += +item.selling_price;
    },

    reduceOrder: function(item) {
      this.chosenIngredients.splice(this.chosenIngredients.indexOf(item), 1);
      this.price += -item.selling_price;
    },

    placeOrderClick() {
      if (this.eatHome) {
        this.show('payment')
      }
      else {
        this.show('confirmation')
      }
    },
    confirmOrder() {
      this.hide('payment')
      this.show('confirmation')
    },

    placeOrder: function() {
      var i,
        //Wrap the order in an object
        order = {
          ingredients: this.chosenIngredients,
          price: this.price

        };
      // make use of socket.io's magic to send the stuff to the kitchen via the server (app.js)
      this.$store.state.socket.emit('order', {
        order: order
      });

      //set all counters to 0. Notice the use of $refs
      for (i = 0; i < this.$refs.ingredient.length; i += 1) {
        this.$refs.ingredient[i].resetCounter();
      }
      this.price = 0;
      this.chosenIngredients = [];
      this.allIIngredients.clear
    },
    countNumberOfIngredients: function(id) {
      let counter = 0;
      for (var amountOfIngred in this.chosenIngredients) {
        //Now we have an array of ingredients in an order which is checked with the id that being sent from countAllIngredients in the call
        if (this.chosenIngredients[amountOfIngred].ingredient_id === id) {
          counter += 1;
        }
      }
      return counter;
    }
  }
}
</script>
 <style scoped>
.startpage-container {
  text-align: center;
}
.startpage {
  background: linear-gradient( rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('~@/assets/background.jpg');
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 1.5em;
  text-transform: uppercase;
  text-align: center;
}
#placeOrderBox {
  position: fixed;
  font-size: 24px;
  color: white;
  text-align:center;
  display:block;
  box-sizing:border-box;
  height: 10em;
  margin-top:5em;
  margin-left:50em;
  border-top:4px solid rgb(196, 196, 196);
  border-left: 4px solid rgb(196, 196, 196);
  border-bottom: 6px solid rgb(196, 196, 196);
  border-color:white;
}

#placeOrderButton{
  background-image:url(https://img.freepik.com/free-photo/blank-concrete-white-wall-texture-background_1017-15560.jpg?size=626&ext=jpg);
  border-width:0.15em;
  border-radius: 5px;
  border: 5px solid white;
  color: black;
  font-size: 16pt;
  text-transform: uppercase;
  text-align: center;
  margin-left: 1em;
  margin-right: 1em;
  flex: 1 0 0;
}
#placeOrderButtontwo{
  background-image:url(https://img.freepik.com/free-photo/blank-concrete-white-wall-texture-background_1017-15560.jpg?size=626&ext=jpg);
  border-width:0.15em;
  border-radius: 5px;
  border: 5px solid white;
  color: black;
  font-size: 16pt;
  text-transform: uppercase;
  text-align: center;
  margin-left: 1em;
  margin-right: 1em;
  flex: 1 0 0;
}

#placeOrderButton:hover {
    box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 30px 0 rgba(0,0,0,0.19);
    color:white;
}

#backButtons {
  margin-left:95%;
  text-align: center;
  display: inline-flex;
  justify-content: left;
}
#langButton {
  position: absolute;
  top: 30px;
  right: 50px;
  padding: 0;
  margin: 0;
  background: transparent;
  border: transparent;
}
#langPic {
    height: 100%;
  }
.all-ingredients {
  margin-right: 400px;
  margin-bottom: 100px;
}
.categoryList {
  display: flex;
  flex-direction: row;

}
.categoryList button {
  background-image:url(https://img.freepik.com/free-photo/white-marble-texture-background-abstract-marble-texture-natural-patterns-design_41389-323.jpg?size=626&ext=jpg);
  border-width:0.15em;
  width: 200px;
  padding: 40px;
  border-top-right-radius: 4em;
  border-top-left-radius:1em;
  border-top-style:groove;
  font-size: 1.3em;
}
.categoryList button:hover {
  box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 30px 0 rgba(0,0,0,0.19);
  color:white;
  text-shadow: 3px 3px rgba(0,0,0,0.24);
}
.ingredient-container {
  display: flex;
  flex-wrap: wrap;
}
.ingredient-box {
  width: 25%;
  display: flex;
}

.payment{
  color: black;
  padding: 20px;
}
/*.ingredient-container > .ingredientBox {
	display: flex;
	flex-wrap: wrap;
  text-align: center;
}
.ingredient-container > .ingredientBox > .ingredientBox {
	flex-grow: 1;
	width: 33%;
}
.ingredient-container > .ingredientBox> .ingredientBox :nth-child(even) {
}
.ingredient-container > .ingredientBox > .ingredientBox:nth-child(odd) {
}

.ingredientBox {
  justify-content: left;
  margin-right: 30%;
  font-size: 0.8em;
  text-transform: uppercase;
}*/
 /*Tror app overridar fonten i detta av någon anledning.. Detta är alltså orderboxen */

/*.placeOrderBox {
  font-size: 24px;
  text-align:center;
  position: fixed;
  display:block;
  box-sizing:border-box;
  min-width: 100em;
  height: 10em;
  top:14em;
  left:50em;
  border-top:1px solid rgb(196, 196, 196);
  border-left: 1px solid rgb(196, 196, 196);
}*/

.example-panel {
  background-image: url('~@/assets/exampleImage.jpg');
  width: 18em;
  z-index: 2;
}
.ingredient {
  border: 3px solid #ccd;
  padding: 0.8em;
  color: white;
  background-image: url('~@/assets/exampleImage.jpg');
  flex-grow: 1;
}

</style>
