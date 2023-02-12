const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()
  blogObject = new Blog(helper.initialBlogs[2])
  await blogObject.save()
  blogObject = new Blog(helper.initialBlogs[3])
  await blogObject.save()
  blogObject = new Blog(helper.initialBlogs[4])
  await blogObject.save()
  blogObject = new Blog(helper.initialBlogs[5])
  await blogObject.save()
})

test('the correct amount of blogs are returned as json', async () => {
  const response = await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/)

  expect(response.body).toHaveLength(6)
})

test('blogs have identifier id', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body[0].id).toBeDefined()
})

test('post creates new blog and adds to the list', async () => {
  const newBlog = {
    title: "Microservice Architecture",
    author: "Michael Fonder",
    url: "https://michaelfonder.com/articles/microservices.html",
    likes: 8,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  const contents = blogsAtEnd.map(b => b.title)

  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
  expect(contents).toContainEqual('Microservice Architecture')
})

test('if the posted blog lacks likes, then it is set to 0', async () => {
  const newBlog = {
    title: "UFO and Chupacabras",
    author: "Uma Alien",
    url: "https://uma.com/articles/ufo-and-chupacabras.html",
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  const addedBlog = blogsAtEnd[blogsAtEnd.length - 1]

  expect(addedBlog.likes).toBe(0)

})

test('if the title or url is missing, then return bad request', async () => {
  const responseBafore = await api.get('/api/blogs')
  const lengthBefore = responseBafore.body.length

  const newBlog1 = {
    author: "Uma Alien",
    url: "https://uma.com/articles/ufo-and-chupacabras.html",
    likes: 3
  }

  await api
    .post('/api/blogs')
    .send(newBlog1)
    .expect(400)

  const newBlog2 = {
    title: "Analyzing Trends in Movie Industry",
    author: "Filma Cinema",
    likes: 1
  }

  await api
    .post('/api/blogs')
    .send(newBlog2)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()  

  expect(blogsAtEnd).toHaveLength(lengthBefore)
})

test('delete a single blog post resourse', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(
    helper.initialBlogs.length - 1
  )

  const contents = blogsAtEnd.map(b => b.title)

  expect(contents).not.toContain(blogToDelete.title)
})

afterAll(async () => {
  await mongoose.connection.close()
})