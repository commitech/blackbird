var crypto = require('crypto');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    matric_number: {
      type: DataTypes.STRING,
      allowNull: true
    },
    contact: {
      type: DataTypes.STRING,
      allowNull: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    is_admin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: '0'
    },
    cell: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'none'
    },
    position: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Subcom'
    },
    status: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: '1'
    },
    tracking: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '0'
    },
    is_duty: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '1'
    },
    is_notification: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.fn('NOW')
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.fn('NOW')
    }
  }, {
    instanceMethods: {
      verifyPassword: function(password) {
        if (!password) {
          return false;
        }
        var shasum = crypto.createHash('sha1');
        shasum.update(password);
        var digest = shasum.digest('hex');
        return (digest === this.password);
      }
    }
  });
};
