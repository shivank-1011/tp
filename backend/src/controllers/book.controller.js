const { PrismaClient } = require("../../generated/prisma");
const prisma = new PrismaClient();

module.exports = {
  async list(req, res) {
    try {
      const books = await prisma.book.findMany({
        include: { author: true, genres: true },
      });
      res.json(books);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async detail(req, res) {
    try {
      const book = await prisma.book.findUnique({
        where: { id: Number(req.params.id) },
        include: { author: true, genres: true },
      });
      if (!book) return res.status(404).json({ error: "Book not found" });
      res.json(book);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async create(req, res) {
    try {
      const { title, summary, ISBN, authorId, genreIds, url } = req.body;
      const book = await prisma.book.create({
        data: {
          title,
          summary,
          ISBN,
          url,
          author: { connect: { id: authorId } },
          genres: { connect: genreIds.map((id) => ({ id })) },
        },
        include: { author: true, genres: true },
      });
      res.status(201).json(book);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  async update(req, res) {
    try {
      const { title, summary, ISBN, authorId, genreIds, url } = req.body;
      const book = await prisma.book.update({
        where: { id: Number(req.params.id) },
        data: {
          title,
          summary,
          ISBN,
          url,
          author: { connect: { id: authorId } },
          genres: { set: genreIds.map((id) => ({ id })) },
        },
        include: { author: true, genres: true },
      });
      res.json(book);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  async remove(req, res) {
    try {
      await prisma.book.delete({ where: { id: Number(req.params.id) } });
      res.status(204).end();
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};
