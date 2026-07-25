const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const CheckIn = require('./models/CheckIn');
const EducationalResource = require('./models/EducationalResource');
const CaregiverAlert = require('./models/CaregiverAlert');
const env = require('./config/env');

dotenv.config();

const seedData = async () => {
  try {
    console.log('[Seed] Connecting to database...');
    await mongoose.connect(env.MONGODB_URI);
    console.log('[Seed] Connected to MongoDB.');

    // Clear existing collections for clean seed
    await User.deleteMany({});
    await CheckIn.deleteMany({});
    await EducationalResource.deleteMany({});
    await CaregiverAlert.deleteMany({});

    console.log('[Seed] Cleared existing data.');

    // Create Caregiver user
    const caregiver = await User.create({
      name: 'Dr. Sarah Jenkins',
      email: 'caregiver@example.com',
      password: 'Password123!',
      role: 'caregiver',
      caregiverCode: 'CG-AURA99',
      recoveryGoal: 'Providing professional support and monitoring for patients in recovery',
    });

    // Create Patient user linked to Caregiver
    const patient = await User.create({
      name: 'Alex Morgan',
      email: 'user@example.com',
      password: 'Password123!',
      role: 'patient',
      caregiverId: caregiver._id,
      streak: 12,
      lastCheckInDate: new Date().toISOString().split('T')[0],
      recoveryGoal: 'Building daily resilience and emotional stability',
      emergencyContacts: [
        { name: 'Dr. Sarah Jenkins', phone: '555-0199', relationship: 'Caregiver' },
        { name: 'National Crisis Line', phone: '988', relationship: 'Emergency' },
      ],
    });

    // Create Admin user
    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@example.com',
      password: 'Password123!',
      role: 'admin',
      recoveryGoal: 'Platform operations and maintenance',
    });

    console.log('[Seed] Demo users created:');
    console.log('  - Patient: user@example.com / Password123!');
    console.log('  - Caregiver: caregiver@example.com / Password123!');
    console.log('  - Admin: admin@example.com / Password123!');

    // Create historical check-ins for patient
    const today = new Date();
    const mockCheckIns = [];

    for (let i = 10; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];

      const mood = Math.min(5, Math.max(2, 3 + Math.floor(Math.sin(i) * 2)));
      const cravingLevel = Math.min(10, Math.max(1, 4 - Math.floor(Math.sin(i) * 3)));
      const riskScore = Math.round((6 - mood) * 10 + cravingLevel * 4);

      mockCheckIns.push({
        userId: patient._id,
        date: dateStr,
        mood,
        cravingLevel,
        sleepHours: 7 + (i % 2),
        triggers: i % 3 === 0 ? ['Stress', 'Tiredness'] : [],
        notes: `Day ${12 - i} reflection: Staying focused on mindfulness and grounding routines.`,
        riskScore,
        aiFeedback: 'Great job tracking your daily recovery! Keep practicing deep breathing when cravings surge.',
      });
    }

    await CheckIn.insertMany(mockCheckIns);
    console.log('[Seed] Inserted 11 historical daily check-ins.');

    // Create Educational Resources
    const educationalResources = [
      {
        title: 'Mastering Urge Surfing: A Mindfulness Guide',
        category: 'Mindfulness',
        slug: 'mastering-urge-surfing',
        summary: 'Learn how to ride out cravings like waves without giving in, using evidence-based mindfulness.',
        content: `Cravings are temporary neuro-chemical surges that peak within 15 to 20 minutes before naturally fading away. Urge surfing is a cognitive behavioral technique where you observe the physical sensations of a craving without resisting or acting on it.

### Step-by-Step Urge Surfing Technique:
1. **Notice the Craving**: Acknowledge that a craving has arrived without self-judgment.
2. **Scan Your Body**: Locate where you feel physical tension (tight chest, elevated heart rate, restlessness).
3. **Focus on Breathing**: Breathe deeply and visualize the craving as an ocean wave rising, cresting, and descending.
4. **Remain Present**: Remind yourself: "This feeling is temporary. I do not have to act on it."`,
        readTime: 4,
        tags: ['mindfulness', 'craving-management', 'cbt'],
      },
      {
        title: 'Building a Relapse Prevention Network',
        category: 'Relapse Prevention',
        slug: 'building-relapse-prevention-network',
        summary: 'Discover how connecting with caregivers, support groups, and emergency contacts creates an unbreakable recovery safety net.',
        content: `Isolation is one of the highest risk factors in addiction recovery. Establishing a clear, structured support system ensures you are never alone when unexpected distress or cravings strike.

### Core Components of a Prevention Network:
- **Caregiver & Support Team**: Regular check-ins with designated professionals or accountability partners.
- **Emergency Contacts**: Preset crisis lifelines (like 988) and trusted personal contacts.
- **Daily Check-In Routines**: Consistently logging your mood, sleep, and triggers to detect high-risk trends early.`,
        readTime: 5,
        tags: ['prevention', 'support', 'caregiver'],
      },
      {
        title: 'The Science of Neuroplasticity in Healing',
        category: 'Neuroscience of Recovery',
        slug: 'neuroplasticity-in-recovery',
        summary: 'Understand how your brain rewires and repairs reward pathways through daily consistent self-care and abstinence.',
        content: `Your brain possesses incredible neuroplasticity—the ability to reorganize pathways and build new neural connections. Every single day you practice grounding exercises, complete daily check-ins, or manage stress mindfully, you physically strengthen positive reward pathways in your brain.`,
        readTime: 6,
        tags: ['neuroscience', 'brain-health', 'education'],
      },
    ];

    await EducationalResource.insertMany(educationalResources);
    console.log('[Seed] Inserted Educational Resources.');

    // Create Caregiver Alert for high risk checkin demonstration
    await CaregiverAlert.create({
      caregiverId: caregiver._id,
      patientId: patient._id,
      alertType: 'high_risk_checkin',
      severity: 'medium',
      message: `${patient.name} logged elevated craving levels. Supportive check-in recommended.`,
      isRead: false,
    });

    console.log('[Seed] Seed script completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error);
    process.exit(1);
  }
};

seedData();
