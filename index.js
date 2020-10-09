// require first
const { Module } = require('@dashup/module');

// import base
const ApplicationPage = require('./pages/application');

/**
 * export module
 */
class ApplicationModule extends Module {

  /**
   * construct discord module
   */
  constructor() {
    // run super
    super();
  }
  
  /**
   * registers dashup structs
   *
   * @param {*} register 
   */
  register(fn) {
    // register pages
    fn('page', ApplicationPage);
  }
}

// create new
module.exports = new ApplicationModule();
