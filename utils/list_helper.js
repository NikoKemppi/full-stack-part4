const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    let likes = 0
    for (let i in blogs) {
        likes += blogs[i].likes
    }
    return likes
}
  
module.exports = {
    dummy, totalLikes
}