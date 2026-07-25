const express = require('express');
const {
  getArticles,
  getArticleBySlug,
  explainArticle,
  bookmarkArticle,
  removeBookmark,
  getBookmarks,
} = require('../controllers/educationController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', getArticles);
router.get('/bookmarks', protect, getBookmarks);
router.get('/:slug', getArticleBySlug);
router.post('/:slug/explain', protect, explainArticle);
router.post('/bookmark/:resourceId', protect, bookmarkArticle);
router.delete('/bookmark/:resourceId', protect, removeBookmark);

module.exports = router;
