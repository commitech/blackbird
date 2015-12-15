/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('grabbed_duty', {
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
      type: DataTypes.INTEGER(30),
      allowNull: false
    },
    year: {
      type: DataTypes.INTEGER(30),
      allowNull: false
    },
    venue: {
      type: DataTypes.STRING,
      allowNull: false
    },
    accept_time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: 'CURRENT_TIMESTAMP'
    }
  });
};
