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

const favoriteBlog = (blogs) => {
  let mostLikes = 0
  let favorite = {
    title: "",
    author: "",
    likes: 0
  }
  for (let i in blogs) {
    if (mostLikes <= blogs[i].likes) {
      favorite = {
        title: blogs[i].title,
        author: blogs[i].author,
        likes: blogs[i].likes
      }
      mostLikes = blogs[i].likes
    }
  }
  return favorite
}

module.exports = {
  dummy, totalLikes, favoriteBlog
}