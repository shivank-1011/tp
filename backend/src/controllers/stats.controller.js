const { PrismaClient } = require("../../generated/prisma");
const prisma = new PrismaClient();

module.exports = async (req, res) => {
  try {
    const [bookCount, authorCount, genreCount] = await Promise.all([
      prisma.book.count(),
      prisma.author.count(),
      prisma.genre.count(),
    ]);
    res.json({
      books: bookCount,
      authors: authorCount,
      genres: genreCount,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
