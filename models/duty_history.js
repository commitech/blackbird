/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('duty_history', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    leave_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '48'
    },
    start_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    end_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    accept_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '-1'
    },
    day: {
      type: DataTypes.STRING,
      allowNull: true
    },
    month: {
      type: DataTypes.STRING,
      allowNull: true
    },
    year: {
      type: DataTypes.STRING,
      allowNull: true
    },
    date: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    venue: {
      type: DataTypes.STRING,
      allowNull: false
    },
    accept_time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.fn('NOW')
    },
    release_time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.fn('NOW')
    }
  });
};
