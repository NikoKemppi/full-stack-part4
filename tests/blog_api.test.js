const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const Blog = require('../models/blog')

const initialNotes = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  },
  {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
  },
  {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
  },
  {
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
  },
  {
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialNotes[0])
  await blogObject.save()
  blogObject = new Blog(initialNotes[1])
  await blogObject.save()
  blogObject = new Blog(initialNotes[2])
  await blogObject.save()
  blogObject = new Blog(initialNotes[3])
  await blogObject.save()
  blogObject = new Blog(initialNotes[4])
  await blogObject.save()
  blogObject = new Blog(initialNotes[5])
  await blogObject.save()
})

test('the correct amount of blogs are returned as json', async () => {
  const response = await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/)

  expect(response.body).toHaveLength(6)
})

afterAll(async () => {
  await mongoose.connection.close()
})