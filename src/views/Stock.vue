<template>
    <div id="orders">


        <div id="fixedCategoryTab">
            <button id='langButton' v-on:click='switchLang()'>
                <img id='langPic' v-on:click='switchFlag()' v-if='flag_en' src='@/assets/englishflag.jpg' width="30px" height="20px">
                <img id='langPic' v-on:click='switchFlag()' v-if='flag_sv' src='@/assets/swedishflag.jpg' width="30px" height="20px">
            </button>

            <button id="backButton" type="button" onclick="window.location = '/#/kitchen';"> {{uiLabels.goBack}} </button>


        </div>

        <div class = "row">
        <div class = "column">

            <h3>{{ uiLabels.buns }}</h3>
            <ul v-for="item in ingredients" v-if='item.category == 4' :key="item.ingredient_id">
                <div class = "stocknr"> {{uiLabels.currentStock}}: {{item.stock}}</div>
                <div v-if="lang_en"> {{item.ingredient_en}}</div>
                <div v-if="lang_sv"> {{item.ingredient_sv}}</div>
                <div id = "quantity"> {{item.quantity}} </div>
            </ul>
        </div>

        <div class = "column">
            <h3> {{ uiLabels.meat }} </h3>
            <ul v-for = "item in ingredients" v-if = 'item.category == 1' :key="item.ingredient_id">
                <div class = "stocknr"> {{uiLabels.currentStock}}: {{item.stock}}</div>
                <div v-if="lang_en"> {{item.ingredient_en}} </div>
                <div v-if="lang_sv"> {{item.ingredient_sv}} </div>
                <div id = "quantity"> {{item.quantity}}  </div>
            </ul>
        </div>

        <div class = "column">
            <h3> {{ uiLabels.topping }} </h3>
            <ul v-for = "item in ingredients" v-if = 'item.category == 2' :key="item.ingredient_id" >
                <div class = "stocknr"> {{uiLabels.currentStock}}: {{item.stock}}</div>
                <div v-if="lang_sv"> {{item.ingredient_sv}} </div>
                <div v-if="lang_en"> {{item.ingredient_en}} </div>
                <div id = "quantity"> {{item.quantity}}  </div>
            </ul>
        </div>

        <div class = "column">
            <h3> {{ uiLabels.sauce }} </h3>
            <ul v-for = "item in ingredients" v-if = 'item.category == 3' :key="item.ingredient_id">
                <div class = "stocknr"> {{uiLabels.currentStock}}: {{item.stock}}</div>
                <div v-if="lang_sv"> {{item.ingredient_sv}} </div>
                <div v-if="lang_en"> {{item.ingredient_en}} </div>
                <div id = "quantity"> {{item.quantity}}  </div>
            </ul>
        </div>
    </div>
    </div>
</template>
<script>
    import OrderItem from '@/components/OrderItem.vue'
    import OrderItemToPrepare from '@/components/OrderItemToPrepare.vue'

    //import methods and data that are shared between ordering and kitchen views
    import sharedVueStuff from '@/components/sharedVueStuff.js'

    export default {
        name: 'Ordering',
        components: {
            OrderItem,
            OrderItemToPrepare
        },
        mixins: [sharedVueStuff], // include stuff that is used in both
                                  //the ordering system and the kitchen
        data: function(){
            return {
                chosenIngredients: [],
                price: 0
            }
        },
        methods: {
            markDone: function (orderid) {
                this.$store.state.socket.emit("orderDone", orderid);
            },
            addToOrder: function (item) {
                this.chosenIngredients.push(item);
            },
            showOrder: function() {
                this.orderAdded=!this.orderAdded;
            }
        }
    }
</script>
<style scoped>
    #orders {
        font-size:24pt;
    }

    h1 {
        text-transform: uppercase;
        font-size: 1.4em;
        color: dimgray;
    }

    h3  {
        text-transform: uppercase;
        text-align: center;
        font-size: 20pt;
        color: black;
    }

    .row {
        /*text-align: center;*/
        font-size: 14pt;
        color: black;
        display: flex;
        height: 98%;
    }
    .column {
        flex: 53%;
        border: gray;
        border-width: 4px;
        margin: -3px;
        padding: 16px;
        overflow: scroll;
        height: 600px;
    }

    .left {
        width: 100%;
        float: left;
        overflow: scroll;
    }

    #backButton {
        margin-left:90%;
        text-align: center;
        display: inline-flex;
        justify-content: center;
        background-color: #grey;
        border-radius: 5px;
        border: 5px solid grey;
        color: black;
        font-size: 16pt;
        text-transform: uppercase;
        font-family: 'Montserrat', sans-serif;
        flex: 1 0 0;
    }
    #langPic {
        height: 100%;
    }
    #langButton {
        position: absolute;
        top: 10px;
        left: 20px;
        padding: 0;
        margin: 0;
        background: transparent;
        border: transparent;
    }
</style>

