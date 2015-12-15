var sequelize = new Sequelize('commitech', '', '', {
  host: '54.169.17.107',
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

module.exports = function(wagner) {
  
}