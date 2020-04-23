/**
 * Created by sotelj on 4/22/20.
 */
const loginPage = require('../PageObject/page_object');

// spec.js
describe('Protractor Demo App', () => {
	const //username = userInfo.xferProcessor,
		//password = userInfo.xferProcessorPassword,
		myWait = 10000;

	let originalTimeout;

	beforeEach(() => {
		originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
		jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000;
	});

	afterEach(() => {
		jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
	});

	it('should have a title', () => {
		loginPage.ignoreSyn(false); // true for non angular page use false for angular
		loginPage.getPage();

		expect(browser.getTitle()).toEqual('Super Calculator');
	});
});
