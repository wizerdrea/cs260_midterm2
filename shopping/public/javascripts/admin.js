/* globals Vue, axios */

var app = new Vue({
  el: '#admin',
  data: {
    name: "",
    price: "",
    url: "",
    description: "",
    file: null,
    addItem: null,
    rawProducts: [],
    findTitle: "",
    findItem: null,
    photoURL: "",
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
  created() {
    this.getProducts();
  },
  methods: {
    fileChanged(event) {
      this.file = event.target.files[0]
    },
    async addProduct() {
      try {
        let response = await axios.post('/api/addProduct', {name: this.name, price: this.price, url: this.url});
        this.getProducts();
      }
      catch (error) {
        console.log(error);
      }
    },
    async upload() {
      try {
        const formData = new FormData();
        formData.append('photo', this.file, this.file.name)
        let r1 = await axios.post('/api/photos', formData);
        this.photoURL = r1.data.path;
      }
      catch (error) {
        console.log(error);
      }
    },
    async getProducts() {
      try {
        let response = await axios.get("/api/products");
        this.rawProducts = response.data;
        return true;
      }
      catch (error) {
        console.log(error);
      }
    },
    async deleteProduct(product) {
      try {
        let response = axios.delete("/api/products/" + product._id);
        console.log("done");
        this.getProducts();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
  }
});
