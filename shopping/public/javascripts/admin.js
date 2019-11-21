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
    products: [],
    findTitle: "",
    findItem: null,
    photoURL: "",
  },
  computed: {
    suggestions() {
      return this.items.filter(item => item.title.toLowerCase().startsWith(this.findTitle.toLowerCase()));
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
        this.products = response.data;
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
