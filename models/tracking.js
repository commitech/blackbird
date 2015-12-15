/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tracking', {
    month: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    year: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    indexNo: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    treasurer: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    comcen: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    }
  });
};
