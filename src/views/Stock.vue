<template>
    <div id="orders">


        <div id="fixedCategoryTab">
            <button id='langButton' v-on:click='switchLang()'>
                <img id='langPic' v-on:click='switchFlag()' v-if='flag_en' src='@/assets/englishflag.jpg' width="30px" height="20px">
                <img id='langPic' v-on:click='switchFlag()' v-if='flag_sv' src='@/assets/swedishflag.jpg' width="30px" height="20px">
            </button>

            <button id="backButtons" type="button" onclick="window.location = '/#/kitchen';"> {{uiLabels.goBack}} </button>



        </div>    <div class = "row" align = "left">

        <div class = "column left">
            <h1>{{ uiLabels.stockCurrent }}</h1>
            <div>
                <OrderItem
                        v-for="(order, key) in orders"
                        v-if="order.status === 'done'"
                        :order-id="key"
                        v-on:cancelOrder="markStarted(key)"
                        :order="order"
                        :lang="lang"
                        :ui-labels="uiLabels"
                        :key="key">
                </OrderItem>
            </div>
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

    .row {
        display: flex;
        height: 90%;
    }
    .column {
        border: solid #5a1800;
        border-width: 5px;
        margin: -1px;
        padding: 20px;
        height: 1000px;
    }

    .left {
        width: 100%;
        float: left;
        overflow: scroll;
    }

    #backButtons {
        margin-left:95%;
        text-align: center;
        display: inline-flex;
        justify-content: center;

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

