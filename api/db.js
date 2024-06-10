const { Sequelize, DataTypes, Model } = require("sequelize");
const { resolve } = require("path");

const sequelize = new Sequelize({
  logging: false,
  dialect: "sqlite",
  storage: resolve(process.cwd(), "db.sqlite"),
});

class User extends Model {}

User.init(
  {
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  { sequelize }
);

class PersonalData extends Model {}

PersonalData.init(
  {
    fio: DataTypes.STRING,
    birthdate: DataTypes.DATEONLY,
    telegram: DataTypes.STRING,
    vk: DataTypes.STRING,
  },
  { sequelize }
);

User.hasOne(PersonalData);
PersonalData.belongsTo(User);

sequelize.sync();

module.exports = sequelize;
module.exports.User = User;
module.exports.PersonalData = PersonalData;
