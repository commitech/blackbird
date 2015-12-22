/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sign', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    supervisor_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.fn('NOW')
    },
    venue: {
      type: DataTypes.STRING,
      allowNull: false
    },
    signtype: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
};
