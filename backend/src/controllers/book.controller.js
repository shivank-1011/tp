const { PrismaClient } = require("../../generated/prisma");
const prisma = new PrismaClient();

async function get(req, res) {
  try {
    const books = await prisma.book.findMany({
      include: {
        author: true,
        genres: { include: { genre: true } },
      },
    });
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getById(req, res) {
  try {
    const book = await prisma.book.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        author: true,
        genres: { include: { genre: true } },
      },
    });
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function create(req, res) {
  try {
    const { title, summary, isbn, authorId, genreIds } = req.body;
    const book = await prisma.book.create({
      data: {
        title,
        summary,
        isbn,
        author: { connect: { id: authorId } },
        genres: {
          create: genreIds.map((genreId) => ({
            genre: { connect: { id: genreId } },
          })),
        },
      },
      include: {
        author: true,
        genres: { include: { genre: true } },
      },
    });
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function updateById(req, res) {
  try {
    const { title, summary, isbn, authorId, genreIds } = req.body;
    const bookId = Number(req.params.id);
    // Remove all mappings
    await prisma.bookGenreMapping.deleteMany({ where: { bookId } });
    // Add new mappings
    const book = await prisma.book.update({
      where: { id: bookId },
      data: {
        title,
        summary,
        isbn,
        author: { connect: { id: authorId } },
        genres: {
          create: genreIds.map((genreId) => ({
            genre: { connect: { id: genreId } },
          })),
        },
      },
      include: {
        author: true,
        genres: { include: { genre: true } },
      },
    });
    res.json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function dltById(req, res) {
  try {
    await prisma.book.delete({ where: { id: Number(req.params.id) } });
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = { get, getById, create, updateById, dltById };
