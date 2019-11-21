var express = require('express');
const mongoose = require('mongoose');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});


// connect to the database
mongoose.connect('mongodb://localhost:27017/shopping', {
    useNewUrlParser: true
});

// Configure multer so that it will upload to '/public/images'
const multer = require('multer');
const upload = multer({
    dest: './public/images/',
    limits: {
        fileSize: 10000000
    }
});

// Create a scheme for items in the museum: a title and a path to an image.
const itemSchema = new mongoose.Schema({
    name: String,
    price: String,
    url: String,
    numOrdered: Number,
    checked: Boolean,
});

// Create a model for items in the museum.
const Item = mongoose.model('Item', itemSchema);

//adds product
router.post('/api/addProduct', async(req, res) => {
    const newProduct = new Item({
        name: req.body.name,
        price: req.body.price,
        url: req.body.url,
        numOrdered: 0,
        checked: false
    });
    try {
        await newProduct.save();
        res.send(newProduct);
    }
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

//get list of items
router.get('/api/products', async(req, res) => {
    try {
        let items = await Item.find();
        res.send(items);
    }
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

//adds id to req
router.param('id', function(req, res, next, id) {
    req.id = id;
    return next();
});

//deletes an item
router.delete('/api/products/:id', async(req, res) => {
    try {
        await Item.deleteOne({ _id: req.id });
        res.sendStatus(200);
    }
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.put('/api/products', async(req, res) => {
    try {
        for (let i = 0; i < req.body.items.length; ++i)
        {
            var item = await Item.findOne({ _id: req.body.items[i] });
            item.numOrdered += 1;
            await item.save();
        }
        res.sendStatus(200);
    }
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

// Upload a photo. Uses the multer middleware for the upload and then returns
// the path where the photo is stored in the file system.
router.post('/api/photos', upload.single('photo'), async(req, res) => {
    // Just a safety check
    if (!req.file) {
        return res.sendStatus(400);
    }
    res.send({
        path: "/images/" + req.file.filename
    });
});

// Create a new item in the museum: takes a title and a path to an image.
router.post('/api/items', async(req, res) => {
    const item = new Item({
        title: req.body.title,
        description: req.body.itemDescription,
        path: req.body.path,
    });
    try {
        await item.save();
        res.send(item);
    }
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

// Get a list of all of the items in the museum.
router.get('/api/items', async(req, res) => {
    try {
        let items = await Item.find();
        res.send(items);
    }
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});




// Get a list of all of the items in the museum.
router.delete('/api/items/:id', async(req, res) => {
    try {
        await Item.deleteOne({ _id: req.id });
        res.sendStatus(200);
    }
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

// Get a list of all of the items in the museum.
router.put('/api/items/:id', async(req, res) => {
    try {
        let item = await Item.findOne({ _id: req.id });
        item.title = req.body.title;
        item.description = req.body.description;
        item.save();
        res.sendStatus(200);
    }
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

module.exports = router;
