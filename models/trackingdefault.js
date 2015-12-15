/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('trackingdefault', {
    indexNo: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    progress: {
      type: DataTypes.STRING,
      allowNull: false
    },
    remark: {
      type: DataTypes.STRING,
      allowNull: false
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
