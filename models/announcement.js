/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('announcement', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    time: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    timeline: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.fn('NOW')
    }
  }, {
    classMethods: {
      getAnnouncement: function(userId, callbackOk, callbackError) {
        this.findById(userId).then( function(announcement) {
          callbackOk(announcement);
        }, function(err) {
          callbackError(err);
        });
      },
    }
  });

};
