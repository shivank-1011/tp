const { PrismaClient } = require("../../generated/prisma");
const prisma = new PrismaClient();

module.exports = {
  async list(req, res) {
    try {
      const genres = await prisma.genre.findMany({
        include: { books: true },
      });
      res.json(genres);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async detail(req, res) {
    try {
      const genre = await prisma.genre.findUnique({
        where: { id: Number(req.params.id) },
        include: { books: true },
      });
      if (!genre) return res.status(404).json({ error: "Genre not found" });
      res.json(genre);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async create(req, res) {
    try {
      const { name, url } = req.body;
      const genre = await prisma.genre.create({
        data: { name, url },
        include: { books: true },
      });
      res.status(201).json(genre);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  async update(req, res) {
    try {
      const { name, url } = req.body;
      const genre = await prisma.genre.update({
        where: { id: Number(req.params.id) },
        data: { name, url },
        include: { books: true },
      });
      res.json(genre);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  async remove(req, res) {
    try {
      // Prevent deletion if genre is used by any book
      const books = await prisma.book.findMany({
        where: { genres: { some: { id: Number(req.params.id) } } },
      });
      if (books.length > 0) {
        return res
          .status(400)
          .json({ error: "Cannot delete genre with books" });
      }
      await prisma.genre.delete({ where: { id: Number(req.params.id) } });
      res.status(204).end();
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};
