<template>
  <div class="startpage-container">
    <div class='startpage'>
      <h1 id="startHead"> {{uiLabels.welcomeSite}} </h1>
      <div id="flags">
        <button id='langButton' v-on:click='switchLang()'>
          <img id='langPic' v-on:click='switchFlag()' v-if="flag_en" src= '@/assets/englishflag.jpg' width="30px" height="20px">
          <img id='langPic' v-on:click='switchFlag()' v-if="flag_sv" src= '@/assets/swedishflag.jpg' width="30px" height="20px">
        </button>
      </div>
    </div>

  <div id = "buttons">
      <!-- <router-link :to="{ path:'/'}">{{uiLabels.eatHere}}</router-link> -->
      <button class="startButtons" type="button" @click="$router.push({ path: '/?eat=home'})" > {{uiLabels.eatHere}}  </button>
      <button class="startButtons" type="button" @click="homeDelivery=true" > {{uiLabels.eatAway}} </button>
   </div>
   <div>
     <div class="input-container" v-if="homeDelivery">
       <input class="homeAdress" type="text" :placeholder="uiLabels.eatAway" v-model="$store.state.homeAdress">
       <button class="orderHome" type="button" @click="$router.push('/')" > {{uiLabels.eatHere}}  </button>
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
        homeDelivery: false,
      }
    },
    methods: {
    },
    mounted(){

    }
  }
  </script>

<style>
.startpage-container {
  text-align: center;
}
.startpage {
  background: linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('~@/assets/background.jpg');
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 1.5em;
  text-transform: uppercase;
  text-align: center;
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

#buttons {
  margin-top: 7em;
  text-align: center;
  display: inline-flex;
  justify-content: center;
}

.startButtons{
  background-color: #grey;
  border-radius: 5px;
  border: 5px solid grey;
  color: black;
  font-size: 16pt;
  text-transform: uppercase;
  text-align: center;
  margin-left: 1em;
  margin-right: 1em;
  font-family: 'Montserrat', sans-serif;
  flex: 1 0 0;
}
.input-container {
  margin-top: 6em;
  border-radius: 5px;
  border: 5px solid grey;
  display: inline-flex;
}

.homeAdress{
  background-color: #grey;
  color: black;
  font-size: 16pt;
  min-width: 20em;
  min-height: 1.5em;
  padding: 0.5em;
}

.orderHome{
  font-family: 'Montserrat', sans-serif;
  text-transform: uppercase;
}
/*
#backgr{
  position: relative;
  left: 0px;
  top: 0px;
  width:100%;
  height:100%;
  opacity:0.85;
}

.startButtons {
    background-color: #grey;
    border-radius: 5px;
    border: 5px solid grey;
    color: black;
    font-size: 16pt;
    font-variant: small-caps;
    text-align: center;
  }


.buttonEh{
  grid-column: 1;
  grid-row: 2;
}
.buttonEa{
  grid-column: 2;
  grid-row: 2;
}

#startHead {
  position: absolute;
  top: 180px;
  left: 300px;
  font-weight: 550;
  font-display:swap ;
  font-size: 50pt;
  font-variant:small-caps;
  margin:inherit;
  width: auto;
}

#langButton{
  position: absolute;
  right: 50px;
  top: 50px;
  background: transparent;
  border-color: transparent;
  }
*/
</style>
