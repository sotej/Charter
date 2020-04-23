/* eslint-disable no-undef */
'use strict';

const ElementArrayFinder = $$('').constructor;
const ElementFinder = $('').constructor;

ElementArrayFinder.prototype.getByText = function (compareText) {
	let foundElement;
	return this.each(function (element) {
		element.getWebElement().getText().then(function (elementText) {
			if (elementText.trim() === compareText) {
				foundElement = element;
			}
		});
	}).then(() => {
		return foundElement;
	});
};

ElementArrayFinder.prototype.$$data = ElementFinder.prototype.$$data = function (hook) {
	return this.all(by.dataHookAll(hook));
};

ElementFinder.prototype.$data = function (hook) {
	return this.element(by.dataHook(hook));
};

'use strict';

(function (global) {
	global.$data = function (hook) {
		return element(by.dataHook(hook));
	};

	global.$$data = function (hook) {
		return element.all(by.dataHookAll(hook));
	};
})(global);

'use strict';

const TIMEOUT = 1000;
const DEFAULT_WIDTH = 1280;
const DEFAULT_HEIGHT = 1024;

function Helpers() {
	browser.getCapabilities().then(function (cap) {
		this.browserName = cap.get('browserName');
	}.bind(this));
}

// Promise helpers
Helpers.prototype.not = function (promise) {
	return promise.then(function (result) {
		return !result;
	});
};

// Translation helpers
Helpers.prototype.translate = function (key, values) {
	return browser.executeScript(function (key, values) {
		let $translate = angular.element(document.body).injector().get('$translate');
		$translate = $translate.instant || $translate;
		return $translate(key, values);
	}, key, values);
};

// Page helpers
Helpers.prototype.safeGet = function (url) {
	browser.get(url);
	this.maximizeWindow();
	this.resetPosition();
};

// maximized window helpers
Helpers.prototype.maximizeWindow = function (width, height) {
	width = width || DEFAULT_WIDTH;
	height = height || DEFAULT_HEIGHT;
	browser.driver.manage().window().setSize(width, height);
};

// Position helpers
Helpers.prototype.resetPosition = () => {
	$$('[data-hook=start-point]').each(function (startPoint) {
		browser.actions().mouseMove(startPoint).perform();
	});
};

Helpers.prototype.moveToElement = function (dataHook) {
	$$(dataHook).each(function (element) {
		browser.actions().mouseMove(element).perform();
	});
};
// Hover helpers
Helpers.prototype.displayHover = function (element) {
	browser.actions().mouseMove(element).perform();
	return browser.wait(() => {
		return element.isDisplayed();
	});
};

// Calling isDisplayed when element is not present causes an exception.
//Helpers.prototype.waitForElement = function (element, timeout, optionalMessage) {
Helpers.prototype.waitForElement = function (element, timeout) {

	return browser.wait(() => {
		return element.isPresent().then(function (isPresent) {
			if (isPresent) {
				return element.isDisplayed();
			}
			else {
				return false;
			}
		});
		//}, timeout || TIMEOUT, optionalMessage);
	}, timeout || TIMEOUT, 'Element: ' + element.locator().toString() + ' Was not found within specified time');
};

// Calling isDisplayed when element is not present causes an exception.
Helpers.prototype.waitForElementToDisappear = function (element, timeout, optionalMessage) {
	const _this = this;
	return browser.wait(() => {
		return element.isPresent().then(function (isPresent) {
			if (isPresent) {
				return _this.not(element.isDisplayed());
			}
			else {
				return true;
			}
		});
	}, timeout || TIMEOUT, optionalMessage);
};

// Select element helper (filter by text)
Helpers.prototype.selectOptionByText = function (select, text) {
	const optionElement = select.all(by.cssContainingText('option', text)).get(0);  // Use get(0) since you might have 2 selections starting with same name and grab first selection.  Ex. United States and United States Minor ...
	this.selectOption(optionElement);
};

// Select element helper (filter by index)
Helpers.prototype.selectOptionByIndex = function (select, index) {
	const optionElement = select(by.css('option')).get(index);
	this.selectOption(optionElement);
};

// Select helpers
Helpers.prototype.selectOption = function (optionElement) {
	if (this.isFirefox()) {
		browser.actions().mouseMove(optionElement).mouseDown().mouseUp().perform();
	}
	else {
		optionElement.click();
	}
};

Helpers.prototype.scrollToElement = function (element) {
	return element.getLocation().then(function (location) {
		return browser.executeScript('window.scrollTo(' + location.x + ', ' + location.y + ');');
	});
};

Helpers.prototype.clickElementWithScroll = function (element) {
	return this.scrollToElement(element).then(() => {
		return element.click();
	});
};

// Firefox detection helpers
Helpers.prototype.isFirefox = () => {
	return this.browserName === 'firefox';
};

// IE detection helpers
Helpers.prototype.isIE = () => {
	return this.browserName === 'internet explorer';
};

// Safari detection helpers
Helpers.prototype.isSafari = () => {
	return this.browserName === 'Safari';
};

// Safari detection helpers
Helpers.prototype.isChrome = () => {
	return this.browserName === 'chrome';
};

// Descriptive error messages.
Helpers.prototype.createMessage = function (actual, message, isNot) {
	let msg = message
		.replace('{{actual}}', actual)
		.replace('{{not}}', (isNot ? ' not ' : ' '));

	if (actual.locator) {
		msg = msg.replace('{{locator}}', actual.locator());
	}

	return msg;
};

// Input clear & set values helpers
Helpers.prototype.clearAndSetValue = function (input, value) {
	return input.clear().then(() => {
		return input.sendKeys(value);
	});
};

// ClassName helpers
Helpers.prototype.hasClass = function (element, className) {
	return element.getAttribute('class').then(function (classes) {
		return classes.split(' ').indexOf(className) !== -1;
	});
};

// get input value helpers
Helpers.prototype.hasValue = function (element, expectedValue) {
	return element.getAttribute('value').then(function (value) {
		return value === expectedValue;
	});
};

// link helpers
Helpers.prototype.hasLink = function (element, url) {
	return element.getAttribute('href').then(function (href) {
		return href === url;
	});
};

// is disabled helpers
Helpers.prototype.isDisabled = function (element) {
	return element.getAttribute('disabled').then(function (value) {
		return value === 'true';
	});
};

// is checked helpers
Helpers.prototype.isChecked = function (element) {
	return element.getAttribute('checked').then(function (value) {
		return value;
	});
};

// Console error helpers
// Returns a promise which is resolved with an array of all the console errors
Helpers.prototype.getFilteredConsoleErrors = () => {
	if (!this.isIE()) {
		return browser.manage().logs().get('browser').then(function (browserLog) {
			//in CI livereload is not loaded, nsITaskbarTabPreview.invalidate is a mozilla bug
			const filteredLog = browserLog.filter(function (element) {
				return element.level.value > 900 &&
                    element.message.indexOf('livereload.js') === -1 &&
                    element.message.indexOf('0x80004005 (NS_ERROR_FAILURE) [nsITaskbarTabPreview.invalidate]') === -1;
			});
			if (filteredLog.length > 0) {
				// eslint-disable-next-line no-console
				console.log('Browser log: ' + require('util').inspect(filteredLog));
			}
			return filteredLog;
		});
	}
};

Helpers.prototype.switchWindow = (x) => {
	browser.getAllWindowHandles().then(function(handles){
		return browser.switchTo().window(handles[x]);
	});
};

module.exports = new Helpers();

'use strict';
const SINGLE_LOCATOR = 'dataHook';
const MULTI_LOCATOR = 'dataHookAll';

// Data-hook is a unique attribute to find elements in e2e tests.
(() => {
	by.addLocator(SINGLE_LOCATOR, function (hook, optParentElement, optRootSelector) {
		const using = optParentElement || (optRootSelector && document.querySelector(optRootSelector)) || document;
		return using.querySelector('[data-hook=\'' + hook + '\']');
	});

	by.addLocator(MULTI_LOCATOR, function (hook, optParentElement, optRootSelector) {
		const using = optParentElement || (optRootSelector && document.querySelector(optRootSelector)) || document;
		return using.querySelectorAll('[data-hook=\'' + hook + '\']');
	});
})();
'use strict';

(() => {
	const helpers = new Helpers();

	////////////////////////////////////////////////////////////////////////////////////////////////////
	//	Money Matcher Functions
	////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
     * Gets a number and adds commas in the right place
     * @param number
     * @returns {string}
     */
	const getNumberWithCommas = function (number) {
		return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	};

	/**
     * Creates a regular expression to match money representation with or without spaces in between
     * @param matchedValue - the number that is tested
     * @param expectedValue - the number to match against
     * @param currencySymbol[optional] {string} - the symbol to match against.
     *                           if not specify - validate that there is no symbol.
     * @param isFraction[optional] {boolean} - flag to add the necessary postfix to expectedValue
     * @returns {RegExp}
     */
	const createMoneyRegexp = function (matchedValue, expectedValue, currencySymbol, isFraction) {
		// get value with fraction
		expectedValue = getNumberWithCommas(expectedValue);
		if (isFraction === true && expectedValue.indexOf('.') === -1) {
			expectedValue += '.00';
		}

		// add minus and symbol if needed
		let expression = '^';
		if (matchedValue.indexOf('-') !== -1) {
			expression += '-';
		}
		expression += '\\s*';
		if (typeof currencySymbol === 'string') {
			expression += '\\' + currencySymbol + '\\s*';
		}
		return new RegExp(expression + expectedValue + '$');
	};

	beforeEach(() => {
		jasmine.addMatchers({
			toBePresent: () => {
				return {
					compare: function (actual) {
						const result = {};
						result.pass = actual.isPresent().then(function (pass) {
							result.message = helpers.createMessage(actual, 'Expected {{locator}}{{not}}to Be Present', pass);
							return pass;
						});
						return result;
					}
				};
			},
			toBeDisplayed: () => {
				return {
					compare: function (actual) {
						const result = {};
						result.pass = actual.isDisplayed().then(function (pass) {
							result.message = helpers.createMessage(actual, 'Expected {{locator}}{{not}}to Be Displayed', pass);
							return pass;
						});
						return result;
					}
				};
			},
			toHaveCountOf: () => {
				return {
					compare: function (actual, expectedCount) {
						const result = {};
						result.pass = (() => {
							result.message = helpers.createMessage(actual, 'Expected {{locator}}{{not}}to have length of ' + expectedCount + ' but was {{actual}}', actual === expectedCount);
							return actual === expectedCount;
						})();
						return result;
					}
				};
			},
			toHaveText: () => {
				return {
					compare: function (actual, expectedText) {
						const result = {};
						result.pass = actual.getText().then(function (text) {
							result.message = helpers.createMessage(actual, 'Expected {{locator}}{{not}}to have text ' + expectedText + ' but was ' + text, (text === expectedText));
							return text === expectedText;
						});
						return result;
					}
				};
			},
			toMatchRegex: () => {
				return {
					compare: function (actual, expectedPattern) {
						const re = new RegExp(expectedPattern);
						const result = {};
						result.pass = actual.getText().then(function (text) {
							result.message = helpers.createMessage(actual, 'Expected {{locator}}with text ' + text + '{{not}}to match pattern ' + expectedPattern, re.test(text));
							return re.test(text);
						});
						return result;
					}
				};
			},
			toMatchMoney: () => {
				return {
					compare: function (actual, expectedValue, currencySymbol) {
						const regexExpectedValue = createMoneyRegexp(actual, expectedValue, currencySymbol);
						const result = {};
						result.pass = (() => {
							result.message = helpers.createMessage(actual, 'Expected ' + actual + '{{not}}to match money pattern ' + regexExpectedValue, regexExpectedValue.test(actual));
							return regexExpectedValue.test(actual);
						})();
						return result;
					}
				};
			},
			toMatchMoneyWithFraction: () => {
				return {
					compare: function (actual, expectedValue, currencySymbol) {
						const regexExpectedValue = createMoneyRegexp(actual, expectedValue, currencySymbol, true);
						const result = {};
						result.pass = (() => {
							result.message = helpers.createMessage(actual, 'Expected ' + actual + '{{not}}to match money pattern ' + regexExpectedValue, regexExpectedValue.test(actual));
							return regexExpectedValue.test(actual);
						})();
						return result;
					}
				};
			},
			toHaveValue: () => {
				return {
					compare: function (actual, expectedValue) {
						const result = {};
						result.pass = helpers.hasValue(actual, expectedValue).then(function (pass) {
							result.message = helpers.createMessage(actual, 'Expected {{locator}}{{not}}to have value ' + expectedValue, pass);
							return pass;
						});
						return result;
					}
				};
			},
			toHaveClass: () => {
				return {
					compare: function (actual, className) {
						const result = {};
						result.pass = helpers.hasClass(actual, className).then(function (pass) {
							result.message = helpers.createMessage(actual, 'Expected {{locator}}{{not}}to have class ' + className, pass);
							return pass;
						});
						return result;
					}
				};
			},
			toHaveUrl: () => {
				return {
					compare: function (actual, url) {
						const result = {};
						result.pass = helpers.hasLink(actual, url).then(function (pass) {
							result.message = helpers.createMessage(actual, 'Expected {{locator}}{{not}}to have url ' + url, pass);
							return pass;
						});
						return result;
					}
				};
			},
			toBeDisabled: () => {
				return {
					compare: function (actual) {
						const result = {};
						result.pass = helpers.isDisabled(actual).then(function (pass) {
							result.message = helpers.createMessage(actual, 'Expected {{locator}}{{not}}to be Disabled', pass);
							return pass;
						});
						return result;
					}
				};
			},
			toBeChecked: () => {
				return {
					compare: function (actual) {
						const result = {};
						result.pass = helpers.isChecked(actual).then(function (pass) {
							result.message = helpers.createMessage(actual, 'Expected {{locator}}{{not}}to be checked', pass);
							return pass;
						});
						return result;
					}
				};
			},
			toBeValid: () => {
				return {
					compare: function (actual) {
						const result = {};
						result.pass = helpers.hasClass(actual, 'ng-valid').then(function (pass) {
							result.message = helpers.createMessage(actual, 'Expected {{locator}}{{not}} to have valid input value', pass);
							return pass;
						});
						return result;
					}
				};
			},
			toBeInvalid: () => {
				return {
					compare: function (actual) {
						const result = {};
						result.pass = helpers.hasClass(actual, 'ng-invalid').then(function (pass) {
							result.message = helpers.createMessage(actual, 'Expected {{locator}}{{not}} to have invalid input value', pass);
							return pass;
						});
						return result;
					}
				};
			},
			toBeInvalidRequired: () => {
				return {
					compare: function (actual) {
						const result = {};
						result.pass = helpers.hasClass(actual, 'ng-invalid-required').then(function (pass) {
							result.message = helpers.createMessage(actual, 'Expected {{locator}}{{not}} to be required and invalid (when empty)', pass);
							return pass;
						});
						return result;
					}
				};
			},
			toMatchTranslated: () => {
				return {
					compare: function (actual, key, values) {
						const result = {};
						result.pass = helpers.translate(key, values).then(function (translatedStr) {
							const re = new RegExp(translatedStr);
							result.message = helpers.createMessage(actual, 'Expected {{actual}}{{not}} ' + translatedStr + ' (translated from ' + key + ', values: ' + JSON.stringify(values) + ')', re.test(actual));
							return re.test(actual);
						});
						return result;
					}
				};
			}
		});
	});
})();