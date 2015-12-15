/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('duty_dynamic', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    supervisor_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    schedule_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    date: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    month: {
      type: DataTypes.STRING,
      allowNull: false
    },
    year: {
      type: DataTypes.STRING,
      allowNull: false
    },
    venue: {
      type: DataTypes.STRING,
      allowNull: false
    },
    grab_time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: 'CURRENT_TIMESTAMP'
    },
    release_time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: '0000-00-00 00:00:00'
    },
    grabbed: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '-1'
    },
    released: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '-1'
    }
  });
};
