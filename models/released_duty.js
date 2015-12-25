/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('released_duty', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    released_supervisor_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    duty_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    day: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    month: {
      type: DataTypes.INTEGER(30),
      allowNull: false
    },
    year: {
      type: DataTypes.INTEGER(30),
      allowNull: false
    },
    release_time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.fn('NOW')
    },
    grabbed_supervisor_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: null
    },
    grab_time: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.fn('NOW')
    }
  });
};
