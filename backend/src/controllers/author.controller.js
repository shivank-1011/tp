const { PrismaClient } = require("../../generated/prisma");
const prisma = new PrismaClient();

module.exports = {
  async list(req, res) {
    try {
      const authors = await prisma.author.findMany({
        include: { books: true },
      });
      res.json(authors);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async detail(req, res) {
    try {
      const author = await prisma.author.findUnique({
        where: { id: Number(req.params.id) },
        include: { books: true },
      });
      if (!author) return res.status(404).json({ error: "Author not found" });
      res.json(author);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async create(req, res) {
    try {
      const {
        first_name,
        family_name,
        date_of_birth,
        date_of_death,
        name,
        lifespan,
        url,
      } = req.body;
      const author = await prisma.author.create({
        data: {
          first_name,
          family_name,
          date_of_birth,
          date_of_death,
          name,
          lifespan,
          url,
        },
        include: { books: true },
      });
      res.status(201).json(author);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  async update(req, res) {
    try {
      const {
        first_name,
        family_name,
        date_of_birth,
        date_of_death,
        name,
        lifespan,
        url,
      } = req.body;
      const author = await prisma.author.update({
        where: { id: Number(req.params.id) },
        data: {
          first_name,
          family_name,
          date_of_birth,
          date_of_death,
          name,
          lifespan,
          url,
        },
        include: { books: true },
      });
      res.json(author);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  async remove(req, res) {
    try {
      // Prevent deletion if author has books
      const books = await prisma.book.findMany({
        where: { authorId: Number(req.params.id) },
      });
      if (books.length > 0) {
        return res
          .status(400)
          .json({ error: "Cannot delete author with books" });
      }
      await prisma.author.delete({ where: { id: Number(req.params.id) } });
      res.status(204).end();
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};
