const puppeteer = require("puppeteer");

const scrapeLogic = async (res) => {
  const browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath: puppeteer.executablePath(),
  });
  try {
    const page = await browser.newPage()

await page
	.goto(
		'https://www.amazon.com/s?k=macbook+pro&i=todays-deals&crid=3TOXWO4U7EQ9V&sprefix=macbook+pro%2Ctodays-deals%2C374&ref=nb_sb_noss_1',
		{
			waitUntil: 'domcontentloaded',
			timeout: 100000000
		}
	)
	.catch((err) => console.log('error loading url', err))
const localStorageData = await page.evaluate(() => {
	let json = {}
	let fetchedLocalStorage = {
		vse_brila_cc_status: 'disabled',
		SA_Attribution_Cache: '{"html":{},"native":{"Android":{},"iPhone":{}}}',
		SA_StatefulSA: '[]',
		amznfbgid: 'X75-4252134-1727391:1715954865',
		'csa-ctoken-01A3FJ2SYMY9FZX2HMWG': '1715959032299',
		'csa-ctoken-VK7YEBV6KTCZYSFCEV3M': '1715958471573',
		'csa-ctoken-DGHGDTGSRVGAR97QSV0J': '1715959014848',
		'csm-hit':
			'tb:7NB232Q2Q5VRPAV15A3T+s-785QWFG26KA5KRCJ8E9D|1715957373709&t:1715957373709&adb:adblk_no',
		'awa:webapp:sessioninfo':
			'{"isWebApp":false,"timeStamp":1715955417256}',
		sa_fetch_window_config:
			'{"5":{"windowStartTime":1715955438232,"count":1},"10":{"windowStartTime":1715955438232,"count":1},"15":{"windowStartTime":1715955438232,"count":1},"30":{"windowStartTime":1715955438232,"count":1},"60":{"windowStartTime":1715955438232,"count":1}}',
		'a-font-class': 'a-ember',
		'csm-bf':
			'["785QWFG26KA5KRCJ8E9D","01A3FJ2SYMY9FZX2HMWG","DGHGDTGSRVGAR97QSV0J","7NB232Q2Q5VRPAV15A3T","1WDSJW7H39JY5N98SW6B","VK7YEBV6KTCZYSFCEV3M","CGED0SQHRBJF7QSJP9DT"]',
		'csa-ctoken-7NB232Q2Q5VRPAV15A3T': '1715958552280',
		current_lop: 'en_US',
		'csa-tabbed-browsing':
			'{"lastActive":{"visible":true,"pid":"tmpxlo-khfeam-czbuhn-r6598t","tid":"hwk344-z2wj9f-i5z4zk-dwll2f","ent":{"rid":"785QWFG26KA5KRCJ8E9D","ety":"Detail","esty":"Glance"}},"lastInteraction":{"id":"6ipr38-8mqeh9-aldig3-p9wpbv","used":true},"time":1715955612949}',
		'csa-ctoken-CGED0SQHRBJF7QSJP9DT': '1715958453455',
		'puff:suppression':
			'{"136-0265724-8207131":{"disabled":false,"suppressUntil":"2024-05-17T15:07:43.803Z","suppressionMessage":"Customer is unrecognized"}}',
		'csm:adb': 'adblk_no',
		'csa-ctoken-785QWFG26KA5KRCJ8E9D': '1715959212918',
		SA_Cache:
			'{"version":"1.0","TTL":1716041837486,"sessionDayImpressionCount":{},"anchorGroups":{},"context":{"cookies":{"session-id":"136-0265724-8207131","x-main":"unknown","lc-main":"unknown","ubid-main":"132-9016527-8595301"}},"detailpage":{"shoppingAidsList":{"MultiPageShoppingAids":{"data":{},"priorityList":[]},"Hotspots":{"data":{},"priorityList":[]},"Sparkles":{"data":{"AADeeplinkingDetailPageT2":{"identifier":"AADeeplinkingDetailPageT2","displayText":"Open","borderColor":"none","sequenceNum":1,"targetEndpoint":"https://dl.amazon.com/redirect/ref=mm_1_aa_dl_dp_t2?campaignId=M0Ybl5&failureMode=AppStore&url=https%3A%2F%2Fwww.amazon.com%2Fsa-request-url","weblabTriggerOnlyFlag":false,"descriptionColor":"#111","descriptionText":"Open this page in the Amazon app","maxOptOutCount":3,"impressionInterval":2,"typeOfStaticSparkle":"4","clientSideTargetting":"url contains aa_maas","displayIcon":"https://m.media-amazon.com/images/G/01/MaaS-QRCBT/Deeplinking/AmazonShopping-icon.svg","backGroundColor":"#eaeded","maxDisplayCount":100,"bottomNavPadding":"0","borderStyle":"none","invokingEventElement":":root","sparkleType":"static"}},"priorityList":["AADeeplinkingDetailPageT2"]},"Audiospots":{"data":{},"priorityList":[]},"ToolTips":{"data":{"TANDEM_JIT_QTIP_EN_US_MOBILE":{"sequenceNum":10,"elementBorderColor":"#FFA724","weblabTriggerOnlyFlag":false,"elementWidth":390,"elementArrowPosition":"bottommiddle","elementTextColor":"#000000","elementAnchor":"#audiblesampleplayer_mobile","elementDuration":12000,"dismissalButtonText":"userCross","elementBounceDuration":9000,"highlighter":false,"elementDisplayType":"HTML","userState":"ANY","maxDisplayCount":3,"elementHeight":80,"elementValue":"This audiobook uses virtual voice. Try it out by listening to a sample.","anchorGroupImpressionInterval":24,"dismissalType":"userCross","invokingEventElement":"#audiblesampleplayer_mobile","identifier":"TANDEM_JIT_QTIP_EN_US_MOBILE","tipType":"tool_tip","elementBackgroundColor":"#FFA724","impressionInterval":24,"elementStartOffset":0,"scrollToAnchor":false,"elementType":"TEXT"}},"priorityList":["TANDEM_JIT_QTIP_EN_US_MOBILE"]},"BottomSheets":{"data":{},"priorityList":[]}},"TTL":{"expFactor":0,"validTill":1715955438231}}}',
		'csa-ctoken-1WDSJW7H39JY5N98SW6B': '1715958500204'
	}
	for (let a in fetchedLocalStorage) {
		if (!fetchedLocalStorage.hasOwnProperty(a)) continue

		localStorage.setItem(a, fetchedLocalStorage[a])
	}

	for (let i = 0; i < localStorage.length; i++) {
		const key = localStorage.key(i)
		json[key] = localStorage.getItem(key)
	}
	return json
})

await page.evaluate(() => {
	location.reload(true)
})
let textSelector = await page.waitForSelector('.s-title-instructions-style')
let fullTitle = await textSelector?.evaluate((el) => el.textContent)

const searchedResult = await page.evaluate(() => {
	let amazonProduct = []
	let allProducts = [
		...document.querySelectorAll('.s-title-instructions-style')
	]
	allProducts.forEach((product) => {
		amazonProduct.push(product.innerText)
	})
	return amazonProduct
})
    res.send(searchedResult);
  } catch (e) {
    console.error(e);
    res.send(`Something went wrong while running Puppeteer: ${e}`);
  } finally {
    await browser.close();
  }
};

module.exports = { scrapeLogic };
