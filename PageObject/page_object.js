const Login_Page_Object = function () {

	// Variable Declaration - Constants
	const TEST_URL = 'http://juliemr.github.io/protractor-demo/';

	// Browser set up - Methods
	this.getPage = () => {
		browser.get(TEST_URL);
	};

	this.ignoreSyn = (value) => {
		browser.ignoreSynchronization = value;
	};

	this.getUrl = () => {
		expect(browser.getCurrentUrl()).toBe(TEST_URL);
	};

	// Element Declaration - Attributes
	this.userName = element(by.id('username'));
	this.password = element(by.id('password'));
	this.loginButton = element(by.buttonText('Log in'));
};

module.exports = new Login_Page_Object();