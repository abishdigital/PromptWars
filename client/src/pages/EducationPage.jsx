import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { BookOpen, Search, Bookmark, Sparkles, Clock, Tag } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Coping Mechanisms',
  'Relapse Prevention',
  'Mindfulness',
  'Neuroscience of Recovery',
  'Support Systems',
];

const EducationPage = () => {
  const [articles, setArticles] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'bookmarks'
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [aiExplanation, setAiExplanation] = useState('');
  const [explaining, setExplaining] = useState(false);

  useEffect(() => {
    fetchArticles();
    fetchBookmarks();
  }, [selectedCategory, search]);

  const fetchArticles = async () => {
    try {
      const res = await api.get(`/education?category=${selectedCategory}&search=${search}`);
      if (res.data.success) {
        setArticles(res.data.articles || []);
      }
    } catch (err) {
      console.error('Failed to load articles:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookmarks = async () => {
    try {
      const res = await api.get('/education/bookmarks');
      if (res.data.success) {
        setBookmarks(res.data.bookmarks || []);
      }
    } catch (err) {
      console.error('Failed to load bookmarks:', err.message);
    }
  };

  const toggleBookmark = async (article) => {
    const isBookmarked = bookmarks.some((b) => b._id === article._id);
    try {
      if (isBookmarked) {
        await api.delete(`/education/bookmark/${article._id}`);
        setBookmarks((prev) => prev.filter((b) => b._id !== article._id));
      } else {
        await api.post(`/education/bookmark/${article._id}`);
        setBookmarks((prev) => [...prev, article]);
      }
    } catch (err) {
      console.error('Bookmark error:', err.message);
    }
  };

  const handleExplainArticle = async (slug) => {
    setExplaining(true);
    setAiExplanation('');
    try {
      const res = await api.post(`/education/${slug}/explain`);
      if (res.data.success) {
        setAiExplanation(res.data.explanation);
      }
    } catch (err) {
      setAiExplanation('Unable to generate AI summary at this time.');
    } finally {
      setExplaining(false);
    }
  };

  const displayedArticles =
    activeTab === 'bookmarks'
      ? bookmarks
      : articles;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex p-3 rounded-2xl bg-brand-500/10 text-brand-400 border border-brand-500/20 mb-1">
          <BookOpen className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-white">Recovery Education Hub</h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Evidence-based strategies, mindfulness guides, neuroscience insights, and coping skills.
        </p>
      </div>

      {/* Tabs & Search Bar */}
      <div className="glass-card rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Articles
          </button>
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'bookmarks'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Saved Bookmarks ({bookmarks.length})</span>
          </button>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles or topics..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 text-sm"
          />
        </div>
      </div>

      {/* Category Pills */}
      {activeTab === 'all' && (
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-500/20 text-brand-300 border-brand-500/40 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Article Cards Grid */}
      {loading ? (
        <div className="py-16">
          <LoadingSpinner size="lg" />
        </div>
      ) : displayedArticles.length === 0 ? (
        <div className="text-center py-16 text-slate-500 text-sm">
          No educational articles found for your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedArticles.map((article) => {
            const isBookmarked = bookmarks.some((b) => b._id === article._id);
            return (
              <Card key={article._id} hover className="flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {article.category}
                    </span>
                    <button
                      onClick={() => toggleBookmark(article)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isBookmarked ? 'text-amber-400 bg-amber-500/10' : 'text-slate-500 hover:text-slate-300'
                      }`}
                      title={isBookmarked ? 'Remove bookmark' : 'Bookmark article'}
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  <h3 className="text-lg font-bold text-white line-clamp-2">{article.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {article.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {article.readTime} min read
                  </span>
                  <button
                    onClick={() => {
                      setSelectedArticle(article);
                      setAiExplanation('');
                    }}
                    className="font-bold text-brand-400 hover:underline"
                  >
                    Read Article &rarr;
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Article Detail & AI Explanation Modal */}
      {selectedArticle && (
        <Modal
          isOpen={!!selectedArticle}
          onClose={() => setSelectedArticle(null)}
          title={selectedArticle.title}
        >
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-xs text-slate-400 pb-2 border-b border-slate-800">
              <span className="font-semibold text-brand-400">{selectedArticle.category}</span>
              <span>•</span>
              <span>{selectedArticle.readTime} min read</span>
            </div>

            <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
              {selectedArticle.content}
            </div>

            {/* AI Simplify Button & Output Container */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  Gemini AI Summary & Key Takeaways
                </span>
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={explaining}
                  onClick={() => handleExplainArticle(selectedArticle.slug)}
                >
                  {explaining ? 'Generating...' : 'Explain Simply'}
                </Button>
              </div>

              {aiExplanation && (
                <div className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-slate-800 whitespace-pre-wrap">
                  {aiExplanation}
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default EducationPage;
