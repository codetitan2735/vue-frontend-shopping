'use strict'
const merge = require('webpack-merge');
const prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  ROOT_API: '"https://api.easy.restaurant/site/data?hash=853c7059d80f599027fd0261b871d59c1d3607d0"',
  CALC_API: '"https://api.easy.restaurant/order/calc?url=https://order.bakinights.com"'
});
