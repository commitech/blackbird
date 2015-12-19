/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('specific_duty', {
    duty_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    day: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    month: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    year: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    }
  }, {
    classMethods: {
      
    }
  });
};
