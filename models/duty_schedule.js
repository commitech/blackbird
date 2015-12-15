/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('duty_schedule', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    day: {
      type: DataTypes.STRING,
      allowNull: false
    },
    time: {
      type: DataTypes.STRING,
      allowNull: false
    },
    supervisor_cl: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '-1'
    },
    supervisor_yih: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '-1'
    },
    row_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    }
  });
};
