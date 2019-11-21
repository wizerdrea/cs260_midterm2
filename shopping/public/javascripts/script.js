/* globals Vue, axios */

var app = new Vue({
  el: '#app',
  data: {
    items: [],
  },
  created() {
    this.getItems();
  },
  methods: {
    async getItems() {
      try {
        let response = await axios.get("/api/items");
        console.log(response.data);
        this.items = response.data;
        return true;
      } catch (error) {
        console.log(error);
      }
    },
  },
});