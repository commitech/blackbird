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
    },
    classMethods: {
      getUser: function(userId, callbackOk, callbackError) {
        this.findById(userId).then( function(user) {
          callbackOk(user);
        }, function(err) {
          callbackError(err);
        });
      },

      addUser: function(user, unHashedPassword, callbackOk, callbackError) {
        user.is_admin = false;
        user.status = 1;
        user.tracking = 0;
        user.is_duty = 1;
        user.is_notification = 1;
        var shasum = crypto.createHash('sha1');
        shasum.update(unHashedPassword);
        user.password = shasum.digest('hex');
        this.create(user).then( function() {
          callbackOk();
        }, function(err) {
          callbackError(err);
        });
      },

      removeUser: function(user, callbackOk, callbackError) {
        this.destroy({where: {id: user.id}}).then( function() {
          callbackOk();
        }, function(err) {
          callbackError(err);
        });
      },

      editUser: function(user, callbackOk, callbackError) {
        this.update(user, { where: { id: user.id } }).then(function(){
          callbackOk();
        }, function(err){
          callbackError(err);
        });
      },

      editPassword: function(user, unHashedPassword, callbackOk, callbackError) {
        var shasum = crypto.createHash('sha1');
        shasum.update(unHashedPassword);
        var hashedPassword = shasum.digest('hex');
        this.update( {password: hashedPassword}, { where: { id: user.id } }).then(function(){
          callbackOk();
        }, function(err){
          callbackError(err);
        });
      },

      getAllUsers: function(callbackOk, callbackError) {
        this.findAll().then( function(users) {
          callbackOk(users);
        }, function(err) {
          callbackError(err);
        });
      },

      getNotifyUsers: function(callbackOk, callbackError) {
        this.findAll({where: {is_notification: 1}}).then( function(users) {
          callbackOk(users);
        }, function(err) {
          callbackError(err);
        });
      }
    }
  });
};
