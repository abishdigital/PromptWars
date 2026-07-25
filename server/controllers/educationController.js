const EducationalResource = require('../models/EducationalResource');
const Bookmark = require('../models/Bookmark');
const geminiService = require('../services/geminiService');

const SEED_ARTICLES = [
  {
    title: 'Understanding Urge Surfing: Riding Craving Waves',
    slug: 'understanding-urge-surfing',
    category: 'Coping Mechanisms',
    summary: 'Learn how to observe cravings non-judgmentally as physical sensations that peak and pass without acting on them.',
    readTime: 4,
    tags: ['cravings', 'mindfulness', 'coping'],
    content: `Urge Surfing is a mindfulness technique developed by Dr. Alan Marlatt. Cravings are like ocean waves—they build in intensity, reach a peak, and eventually fade away. 
Instead of fighting or giving in to the craving, imagine yourself riding on top of the wave. Pay attention to your body: notice where the physical tension resides, focus on deep, steady breathing, and watch as the urge naturally dissipates over 15 to 20 minutes.`
  },
  {
    title: 'The Neuroscience of Recovery & Neuroplasticity',
    slug: 'neuroscience-of-recovery',
    category: 'Neuroscience of Recovery',
    summary: 'Discover how the brain rewires dopamine pathways and heals through neuroplasticity during continuous recovery.',
    readTime: 6,
    tags: ['brain', 'neuroscience', 'dopamine'],
    content: `Addiction alters the reward circuit in the brain, primarily reducing dopamine receptor availability. However, the human brain possesses extraordinary neuroplasticity—the ability to reorganize itself by forming new neural connections.
Each day spent in recovery allows your brain's prefrontal cortex to regain executive control and restores normal dopamine sensitivity. Healthy habits like exercise, restful sleep, and mindfulness accelerate this healing process.`
  },
  {
    title: 'Building a Relapse Prevention Safety Plan',
    slug: 'relapse-prevention-safety-plan',
    category: 'Relapse Prevention',
    summary: 'A step-by-step guide to identifying early warning signs, personal HALT triggers, and emergency contacts.',
    readTime: 5,
    tags: ['prevention', 'HALT', 'safety-plan'],
    content: `Relapse is a process, not a single event. It often begins emotionally before turning physical. The HALT acronym highlights four vulnerable states: Hungry, Angry, Lonely, and Tired.
Creating a personal safety plan involves: 1) Listing your top 3 emotional triggers, 2) Identifying safe coping activities (such as taking a walk or journaling), and 3) Keeping trusted emergency contacts and support numbers visible.`
  },
  {
    title: 'Box Breathing & Somatic De-escalation',
    slug: 'box-breathing-somatic-deescalation',
    category: 'Mindfulness',
    summary: 'Master the 4-4-4-4 tactical breathing technique used by first responders to calm the nervous system in seconds.',
    readTime: 3,
    tags: ['breathing', 'stress-relief', 'somatic'],
    content: `Box breathing (also known as square breathing) rapidly shifts your autonomic nervous system from fight-or-flight into rest-and-digest mode.
Instructions:
1. Inhale deeply through your nose for 4 seconds.
2. Hold your breath for 4 seconds.
3. Exhale smoothly through your mouth for 4 seconds.
4. Hold empty for 4 seconds. Repeat 4 times.`
  },
  {
    title: 'Nurturing Healthy Support Systems',
    slug: 'nurturing-healthy-support-systems',
    category: 'Support Systems',
    summary: 'How to communicate boundaries, rebuild trust with loved ones, and engage effectively with peer support groups.',
    readTime: 5,
    tags: ['support', 'caregivers', 'boundaries'],
    content: `Recovery flourishes in community. Establishing boundaries with past negative influences and building open communication channels with caregivers or peer support mentors creates an essential safety net. Share your daily check-in milestones and ask for help early when stress accumulates.`
  }
];

// Seed resources helper
const ensureSeeded = async () => {
  try {
    const count = await EducationalResource.countDocuments();
    if (count === 0) {
      await EducationalResource.insertMany(SEED_ARTICLES);
    }
  } catch (err) {
    // Ignore error in non-db environments
  }
};

// @desc Get all educational resources with filtering & search
// @route GET /api/education
const getArticles = async (req, res, next) => {
  try {
    await ensureSeeded();
    const { category, search } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    const articles = await EducationalResource.find(query).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: articles.length,
      articles,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get single article by slug
// @route GET /api/education/:slug
const getArticleBySlug = async (req, res, next) => {
  try {
    await ensureSeeded();
    const article = await EducationalResource.findOne({ slug: req.params.slug });
    if (!article) {
      return res.status(404).json({ success: false, error: 'Article not found' });
    }
    res.status(200).json({
      success: true,
      article,
    });
  } catch (error) {
    next(error);
  }
};

// @desc AI simplify educational article
// @route POST /api/education/:slug/explain
const explainArticle = async (req, res, next) => {
  try {
    await ensureSeeded();
    const article = await EducationalResource.findOne({ slug: req.params.slug });
    if (!article) {
      return res.status(404).json({ success: false, error: 'Article not found' });
    }

    const explanation = await geminiService.explainEducationalTopic(article.title, article.content);
    res.status(200).json({
      success: true,
      explanation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Bookmark resource
// @route POST /api/education/bookmark/:resourceId
const bookmarkArticle = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { resourceId } = req.params;

    const bookmark = await Bookmark.findOneAndUpdate(
      { userId, resourceId },
      { userId, resourceId },
      { upsert: true, new: true }
    );

    res.status(201).json({
      success: true,
      bookmark,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Remove bookmark
// @route DELETE /api/education/bookmark/:resourceId
const removeBookmark = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { resourceId } = req.params;

    await Bookmark.findOneAndDelete({ userId, resourceId });
    res.status(200).json({
      success: true,
      message: 'Bookmark removed',
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get user bookmarks
// @route GET /api/education/bookmarks
const getBookmarks = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const bookmarks = await Bookmark.find({ userId }).populate('resourceId');
    res.status(200).json({
      success: true,
      bookmarks: bookmarks.map((b) => b.resourceId).filter(Boolean),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getArticles,
  getArticleBySlug,
  explainArticle,
  bookmarkArticle,
  removeBookmark,
  getBookmarks,
};
