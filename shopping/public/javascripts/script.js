/* globals Vue, axios */

var app = new Vue({
  el: '#app',
  data: {
    rawProducts: [],
    shoppingCart: [],
  },
  created() {
    this.productsItems();
  },
  computed: {
    products() {
      let returnList = [];
      let test = this.rawProducts.map(a => { return a.name; }).sort();
      for (let i = 0; i < test.length; ++i)
      {
        for (let j = 0; j < this.rawProducts.length; ++j)
        {
          if (this.rawProducts[j].name == test[i])
          {
            returnList.push(this.rawProducts[j]);
            break;
          }
        }
      }
      return returnList;
    }
  },
  methods: {
    async productsItems() {
      try {
        let response = await axios.get("/api/products");
        this.rawProducts = response.data;
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async submitPurchases() {
      try {
        let purchases = [];
        for (let i = 0; i < this.products.length; ++i)
        {
          if (this.products[i].checked)
          {
            purchases.push(this.products[i]._id);
            this.shoppingCart.push(this.products[i]);
            
          }
        }
        let response = await axios.put("/api/products", { items: purchases });
        return true;
      } catch (error) {
        console.log(error);
      }
    },
  },
});