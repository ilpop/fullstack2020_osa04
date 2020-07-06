const Blog = require('../models/blog')


const dummy = (blogs) => {
    const one = 1
    return (one)
}

const totalLikes = (blogs) => {

    const reducer = (sum, blog) => {
        return sum + blog.likes
    }

    return blogs.reduce(reducer,0)
}



const favoriteBlog = (blogs) => {
    let favBlog

    blogs.forEach(blog => {
        if(!favBlog){
            favBlog = blog
        }else {
            if(blog.likes > favBlog.likes){
                favBlog = blog
            }
        }
    })

    return {
        title: favBlog.title,
        author: favBlog.author,
        likes: favBlog.likes

    }

}

module.exports = {
    dummy, totalLikes, favoriteBlog
   
}