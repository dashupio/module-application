
// import page interface
import { Struct } from '@dashup/module';

/**
 * build address helper
 */
export default class ApplicationPage extends Struct {
  /**
   * constructor
   *
   * @param args 
   */
  constructor(...args) {
    // run super
    super(...args);

    // sanitise
    this.keyAction = this.keyAction.bind(this);
  }

  /**
   * returns page type
   */
  get type() {
    // return page type label
    return 'application';
  }

  /**
   * returns page type
   */
  get icon() {
    // return page type label
    return 'fad fa-server text-primary';
  }

  /**
   * returns page type
   */
  get title() {
    // return page type label
    return 'Application';
  }

  /**
   * returns page data
   */
  get actions() {
    // return page data
    return {
      key : this.keyAction,
    };
  }

  /**
   * returns page data
   */
  get data() {
    // return object
    return {
    //  image : 'https://static.dashup.io/public/assets/examples/board.png',
    };
  }

  /**
   * returns object of views
   */
  get views() {
    // return object of views
    return {
      view   : 'page/application',
      config : 'page/application/config',
    };
  }

  /**
   * returns category list for page
   */
  get categories() {
    // return array of categories
    return ['API'];
  }

  /**
   * returns page descripton for list
   */
  get description() {
    // return description string
    return 'Connect external apps to Dashup using API';
  }

  /**
   * application key
   *
   * @param args 
   */
  async keyAction(opts, page) {
    // load key
    const key = await this.dashup.connection.rpc(opts, 'page.key', page);

    // return key
    return key;
  }
}