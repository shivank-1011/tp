const { PrismaClient } = require("../../generated/prisma");
const prisma = new PrismaClient();

async function get(req, res) {
  try {
    const genres = await prisma.genre.findMany({
      include: { books: { include: { book: true } } },
    });
    res.json(genres);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getById(req, res) {
  try {
    const genre = await prisma.genre.findUnique({
      where: { id: Number(req.params.id) },
      include: { books: { include: { book: true } } },
    });
    if (!genre) return res.status(404).json({ error: "Genre not found" });
    res.json(genre);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function create(req, res) {
  try {
    const { name } = req.body;
    const genre = await prisma.genre.create({
      data: { name },
      include: { books: { include: { book: true } } },
    });
    res.status(201).json(genre);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function updateById(req, res) {
  try {
    const { name } = req.body;
    const genre = await prisma.genre.update({
      where: { id: Number(req.params.id) },
      data: { name },
      include: { books: { include: { book: true } } },
    });
    res.json(genre);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function dltById(req, res) {
  try {
    const mappings = await prisma.bookGenreMapping.findMany({
      where: { genreId: Number(req.params.id) },
    });
    if (mappings.length > 0) {
      return res.status(400).json({ error: "Cannot delete genre with books" });
    }
    await prisma.genre.delete({ where: { id: Number(req.params.id) } });
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = { get, getById, create, updateById, dltById };
