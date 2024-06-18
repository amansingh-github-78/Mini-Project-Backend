const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String },
  price: { type: Number, required: true },
  color: { type: String },
  badge: { type: Boolean },
  description: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  brand: { type: String },
  pdf: { type: String },
  specifications: [
    {
      label: { type: String },
      value: { type: String }
    }
  ]
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

