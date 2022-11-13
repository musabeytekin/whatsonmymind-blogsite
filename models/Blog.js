const mongoose = require("mongoose");
const { default: slugify } = require("slugify");
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
    title: {
        type: String,
        required: true,
        minlength: [8, "blog title must be at least 8 characters"],
        unique: true
    },

    content: {
        type: String,
        required: [true, "please provide a blog content"],
    },

    slug: String,
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    likes: [{
        type: mongoose.Schema.ObjectId,
        ref: "User"
    }],
    likeCount : {
        type : Number,
        default : 0,
        min: 0
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});
BlogSchema.pre("save", function(next) {
    if(!this.isModified("title")) return next();
    this.slug = this.makeSlug();

    return next();
})

// BlogSchema.virtual("likeCount").get(function () {
//     return this.likes.length;
// })

BlogSchema.methods.makeSlug = function() {
    return slugify(this.title, {
        replacement: "-",
        remove: /[*+~.()'"!:@]/g,
        lower: true
    })
}



module.exports = mongoose.model("Blog", BlogSchema);