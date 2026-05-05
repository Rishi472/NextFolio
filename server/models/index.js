import { Sequelize, DataTypes } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', 'database.sqlite'),
  logging: false,
});

export const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  profileImage: { type: DataTypes.STRING },
  // Portfolio Config
  theme: { type: DataTypes.STRING, defaultValue: 'modern' },
  colorPalette: { type: DataTypes.STRING, defaultValue: 'blue' },
  layoutStyle: { type: DataTypes.STRING, defaultValue: 'standard' },
});

export const PersonalInfo = sequelize.define('PersonalInfo', {
  fullName: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  location: { type: DataTypes.STRING },
  linkedin: { type: DataTypes.STRING },
  github: { type: DataTypes.STRING },
  summary: { type: DataTypes.TEXT },
});

export const Experience = sequelize.define('Experience', {
  jobTitle: { type: DataTypes.STRING },
  company: { type: DataTypes.STRING },
  startDate: { type: DataTypes.STRING },
  endDate: { type: DataTypes.STRING },
  description: { type: DataTypes.TEXT },
});

export const Education = sequelize.define('Education', {
  degree: { type: DataTypes.STRING },
  school: { type: DataTypes.STRING },
  graduationDate: { type: DataTypes.STRING },
});

export const Project = sequelize.define('Project', {
  title: { type: DataTypes.STRING },
  description: { type: DataTypes.TEXT },
  link: { type: DataTypes.STRING },
  date: { type: DataTypes.STRING },
});

export const Skill = sequelize.define('Skill', {
  name: { type: DataTypes.STRING },
  category: { type: DataTypes.STRING, defaultValue: 'General' }, // For ATS standardisation e.g., 'Tools', 'Cloud Platforms'
});

// Relationships
User.hasOne(PersonalInfo);
PersonalInfo.belongsTo(User);

User.hasMany(Experience);
Experience.belongsTo(User);

User.hasMany(Education);
Education.belongsTo(User);

User.hasMany(Project);
Project.belongsTo(User);

User.hasMany(Skill);
Skill.belongsTo(User);

export const syncDb = async () => {
  try {
    // Disable foreign keys for SQLite during sync
    await sequelize.query('PRAGMA foreign_keys = OFF');
    await sequelize.sync();
    // Re-enable foreign keys
    await sequelize.query('PRAGMA foreign_keys = ON');
    console.log('Database synced');
  } catch (error) {
    console.error('Database sync error:', error.message);
    throw error;
  }
};

export default sequelize;
