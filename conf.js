const
	getDate = require('./util/getmydate.js'),
	finalDate = getDate.getMyDate(),
	nodeModuleDir = 'C:/Users/p2858616/Downloads/node/node_modules/',
	saveDir = 'C:/Users/p2858616/Documents/Data/2020/Protractor/Results/',
	HtmlScreenshotReporter = require(nodeModuleDir + 'protractor-jasmine2-screenshot-reporter'),
	jasmineReporters = require(nodeModuleDir + 'jasmine-reporters'),

	/*reporter = new HtmlScreenshotReporter({
		// Create HTML screenshot reporter
		dest: './Results/Report ' + getDate.getMyDate(),		// File Destination
		filename: 'report ' + finalDate + '.html',	// File Name
		ignoreSkippedSpecs: true,
		showQuickLinks: true, // Display link to each failed spec
		reportTitle: 'Report', // Report Name (Header) default is Report
		reportFailedUrl: true, // Includes current URL where it fails

		// Rename screenshots to current specs name
		pathBuilder(currentSpec, suites, browserCapabilities) {
			mySpec = currentSpec.fullName;
			return browserCapabilities.get('browserName') + ' screenshots/' + mySpec;
		},
	}),*/
	//username = process.env.BROWSERSTACK_USERNAME,
	//accessKey = process.env.BROWSERSTACK_ACCESS_KEY,
	//browserstackLocal = process.env.BROWSERSTACK_LOCAL,
	//browserstackLocalIdentifier = process.env.BROWSERSTACK_LOCAL_IDENTIFIER,

	SpecReporter = require(nodeModuleDir + 'jasmine-spec-reporter').SpecReporter,
	HtmlReporter = require(nodeModuleDir + 'protractor-beautiful-reporter');
 
//let
//mySpec = '';

exports.config = {
	/*multiCapabilities: [{
	   'browserName': 'chrome'
	}, {
	   'browserName': 'firefox'
	}],*/

	capabilities: {
		'browserName': 'chrome',

		//'chromeDriver': '/tmp/chromedriver/chromedriver',
		//'chromedriver.version': 2.38,

		/*// Enable when using it on Jenkins otherwise disable
		'browserstack.user': username,
		'browserstack.key': accessKey,
		'browserstack.local': browserstackLocal,
		'browserstack.localIdentifier': browserstackLocalIdentifier,*/

		/// Enable when testing on local machine otherwise disable
		/*'browserstack.user': 'ericrapp1',
		'browserstack.key': 'oy8tRfzt3TnxhYjcpzsn',
		'browserstack.local': 'true',
		'browserstack.debug': 'true',
		'browserstack.networkLogs': 'true',
		'browserstack.video': 'false',*/

		chromeOptions: {
			// Options can be found here https://peter.sh/experiments/chromium-command-line-switches/
			args: [
				//'--headless',
				//'--ignore-certificate-errors',
				//'--ignore-urlfetcher-cert-requests',
				//'EnableSha1ForLocalAnchors=false',
				//'incognito',
				//'--no-sandbox',
				//'--disable-web-security',
				//'--dns-prefetch-disable',
				//'--ignore-certificate-errors-spki-list',
				//'--allow-insecure-localhost'
				//'--disable-gpu',
				//'--window-size=1920x1080',
				//'--user-agent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70 Safari/537.36"'
			]
		},

		'build': 'Version 1',
		'project': 'Partner API',
		'os': 'Windows'
	},

	framework: 'jasmine',

	specs: [
		'./Specs/spec.js'
	],

	/*suites: {
		fullSmoke: [
			'./specs/get/status.spec.js',
			'./specs/get/termsAndConditions.spec.js',
			'./specs/post/newAccount.spec.js',
			'./specs/get/applicationStatus.spec.js',
			'./specs/get/fundingTermsAndConditions.spec.js',
			'./specs/post/accountFunding.spec.js',
			'./specs/get/custodians.spec.js',
			'./specs/deleteTempFiles/deleteTempFiles.spec.js'
		],
	},*/

	directConnect: true,
	//seleniumAddress: 'http://hub-cloud.browserstack.com/wd/hub',
	//seleniumAddress: 'http://localhost:4444/wd/hub',

	jasmineNodeOpts: {
		defaultTimeoutInterval: 999999,
		print() {
		}, // Remove protractor dot reporter and use SpecReporter
	},

	// Setup the report before any tests start
	beforeLaunch() {
		//return new Promise(((resolve) => {
		//	reporter.beforeLaunch(resolve);
		//}));
	},

	onPrepare: function () {
		// Screenshot Reporter
		//jasmine.getEnv().addReporter(reporter);

		// Add a screenshot reporter and store screenshots to `/tmp/screenshots`:
		jasmine.getEnv().addReporter(new HtmlReporter({
			baseDirectory: saveDir + 'report ' + finalDate
		}).getJasmine2Reporter());

		// Spec Reporter
		jasmine.getEnv().addReporter(new SpecReporter({
			spec: {
				displayStacktrace: 'none',
			},
		}));

		// XML Reporter
		jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
			consolidateAll: true,
			savePath: saveDir,
			filePrefix: 'report ' + finalDate,
		}));
	},

	// Close the report and browser after all tests finish
	afterLaunch(exitCode) {
		//return new Promise(function (resolve) {
		//	reporter.afterLaunch(resolve.bind(this, exitCode));
		//});
	},
};