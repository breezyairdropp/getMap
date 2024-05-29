import * as cheerio from 'cheerio'
import puppeteerExtra from 'puppeteer-extra'
import stealthPlugin from 'puppeteer-extra-plugin-stealth'
import { Cluster } from 'puppeteer-cluster'
import fs from 'fs'

function extract2(string) {
	var regex = /[^0-9-+ ]/g
	return !regex.test(string)
}

let dataTitle = ''

searchGoogleMaps('eatery abuja')

async function searchGoogleMaps(parsedData) {
	dataTitle = parsedData
	try {
		puppeteerExtra.use(stealthPlugin())
		// const browser = await puppeteer.launch({
		// 	headless: 'shell',
		// 	args: ['--enable-gpu'],
		//   });

		const browser = await puppeteerExtra.launch({
			headless: 'shell',
			args: ['--no-sandbox', '--enable-gpu'],
			executablePath:
				'/home/damner/.cache/puppeteer/chrome/linux-125.0.6422.78/chrome-linux64/chrome'
		})

		const page = await browser.newPage()

		// const query = 'Auto repair shops austin'
		// const query = 'eatery uyo akwa ibom'
		// const query = 'eatery abuja'
		const query = parsedData

		try {
			await page.goto(
				`https://www.google.com/maps/search/${query
					.split(' ')
					.join('+')}`
			)
		} catch (error) {
			console.log('error going to page')
		}

		async function autoScroll(page) {
			await page.evaluate(async () => {
				const wrapper = document.querySelector('div[role="feed"]')

				await new Promise((resolve, reject) => {
					var totalHeight = 0
					var distance = 1000
					var scrollDelay = 3000

					var timer = setInterval(async () => {
						var scrollHeightBefore = wrapper.scrollHeight
						wrapper.scrollBy(0, distance)
						totalHeight += distance

						if (totalHeight >= scrollHeightBefore) {
							totalHeight = 0
							await new Promise((resolve) =>
								setTimeout(resolve, scrollDelay)
							)

							// Calculate scrollHeight after waiting
							var scrollHeightAfter = wrapper.scrollHeight

							if (scrollHeightAfter > scrollHeightBefore) {
								// More content loaded, keep scrolling
								return
							} else {
								// No more content loaded, stop scrolling
								clearInterval(timer)
								resolve()
							}
						}
					}, 200)
				})
			})
		}

		await autoScroll(page)

		const html = await page.content()
		const pages = await browser.pages()
		await Promise.all(pages.map((page) => page.close()))

		await browser.close()
		// console.log('browser closed')

		// get all a tag parent where a tag href includes /maps/place/
		const $ = cheerio.load(html)
		// console.log($.html)
		const aTags = $('a')
		const parents = []
		aTags.each((i, el) => {
			const href = $(el).attr('href')
			if (!href) {
				return
			}
			if (href.includes('/maps/place/')) {
				parents.push($(el).parent())
			}
		})

		const buisnesses = []

		parents.forEach((parent) => {
			// console.log(parent)
			// parent.click()
			const url = parent.find('a').attr('href')
			// get a tag where data-value="Website"
			const website = parent.find('a[data-value="Website"]').attr('href')
			// find a div that includes the class fontHeadlineSmall
			const storeName = parent.find('div.fontHeadlineSmall').text()
			// find span that includes class fontBodyMedium
			const ratingText = parent
				.find('span.fontBodyMedium > span')
				.attr('aria-label')

			// get the first div that includes the class fontBodyMedium
			const bodyDiv = parent.find('div.fontBodyMedium').first()
			const children = bodyDiv.children()
			const lastChild = children.last()
			const firstOfLast = lastChild.children().first()
			const lastOfLast = lastChild.children().last()

			buisnesses.push({
				placeId: `ChI${url?.split('?')?.[0]?.split('ChI')?.[1]}`,
				address: firstOfLast?.text()?.split('·')?.[1]?.trim(),
				category: firstOfLast?.text()?.split('·')?.[0]?.trim(),
				phone:
					extract2(lastOfLast?.text()?.split('·')?.[1]?.trim()) ==
					true
						? lastOfLast?.text()?.split('·')?.[1]?.trim()
						: '',
				googleUrl: url,
				bizWebsite: website,
				storeName,
				ratingText,
				stars: ratingText?.split('stars')?.[0]?.trim()
					? Number(ratingText?.split('stars')?.[0]?.trim())
					: null,
				numberOfReviews: ratingText
					?.split('stars')?.[1]
					?.replace('Reviews', '')
					?.trim()
					? Number(
							ratingText
								?.split('stars')?.[1]
								?.replace('Reviews', '')
								?.trim()
					  )
					: null
			})
		})

		fs.writeFileSync(`./${dataTitle}.json`, JSON.stringify(buisnesses))

		getCompleteData(JSON.stringify(buisnesses))
	} catch (error) {
		console.log('error at googleMaps', error.message)
	}
}

async function getCompleteData(parsedData) {
	const cluster = await Cluster.launch({
		concurrency: Cluster.CONCURRENCY_CONTEXT,
		workerCreationDelay: 1000,
		puppeteerOptions: {
			args: ['--no-sandbox', '--disable-setuid-sandbox']
		},
		maxConcurrency: 4
	})

	let completeData = []

	// Define a task to be executed for your data
	await cluster.task(async ({ page, data: url }) => {
		await page.goto(url?.url)

		const html = await page.content()

		// let checkClaim = ''

		// page.evaluate(() => {
		// 	checkClaim = document.querySelector('.CsEnBe')
		// })

		// console.log(checkClaim)

		const $ = cheerio.load(html)
		const aTags = $('div')
		const urlTags = $('a')
		let parent
		let parent2
		const buisnesses = []
		// const parents = []
		aTags.each((i, el) => {
			const href = $(el)?.hasClass('kR99db')
			// console.log('href', href)
			if (!href) {
				return
			}

			parent = $(el)?.parent()

			const phoneDetails = parent?.find('.kR99db')?.text()

			// console.log(phoneDetails[3])

			// const dataBlob = parent.find('a.kR99db').attr('href')
			urlTags.each((i, el) => {
				const href = $(el)?.hasClass('CsEnBe')
				// console.log('href', href)
				if (!href) {
					return
				}
				parent2 = $(el)?.parent()
			})
			console.log(parent2?.find('a.CsEnBe')?.attr('href'))
			const dataBlob = parent2?.find('a.CsEnBe')?.attr('href')

			// if (dataBlob?.indexOf('//business.google.com') >= 0) {
			// 	page.evaluate(() => {
			// 		let wrapper = document.querySelector('a.CsEnBe')
			// 		console.log(wrapper)
			// 	})
			// }

			buisnesses.push({
				title: url.title,
				bizWebsite: dataBlob,
				// bizWebsite:
				// 	dataBlob?.indexOf('//business.google.com') >= 0
				// 		? ''
				// 		: dataBlob,
				googleUrl: url.url,
				phoneNumber: extract2(phoneDetails) == true ? phoneDetails : ''
			})
		})

		const len = (str) => {
			let size = new Blob([str]).size
			return size
		}
		function largest(arrS) {
			let arr = []
			arrS.forEach((arrs) => {
				arr.push(JSON.stringify(arrs))
			})
			// console.log(arr)
			let i
			let max = len(arr[0])
			let realCred = ''
			for (i = 1; i < arr.length; i++) {
				if (len(arr[i]) > max) {
					max = len(arr[i])
					realCred = arr[i]
				}
			}

			return realCred
		}

		// console.log(JSON.parse(largest(buisnesses)))
		completeData.push(JSON.parse(largest(buisnesses)))
		fs.writeFileSync(
			`./${dataTitle}-complete.json`,
			JSON.stringify(completeData)
		)
	})

	JSON.parse(parsedData).forEach((data) => {
		// console.log(data?.phone, data?.bizWebsite)

		if (
			data?.phone == undefined ||
			data?.bizWebsite == undefined ||
			data?.phone == '' ||
			data?.bizWebsite == ''
		) {
			cluster.queue({
				title: data?.storeName,
				url: data?.googleUrl
			})
		}
	})

	// Queue URLs
	// cluster.queue({
	// 	title: 'Foot patrol',
	// 	url: 'https://www.google.com/maps/place/Footpatrol+London/data=!4m7!3m6!1s0x487604d4a56b6511:0xba29007bc2c20952!8m2!3d51.5142605!4d-0.1355634!16s%2Fg%2F1tk674p8!19sChIJEWVrpdQEdkgRUgnCwnsAKbo?authuser=0&hl=en&rclk=1'
	// })
	// cluster.queue({
	// 	title: 'City View',
	// 	url: 'https://www.google.com/maps/place/City+View+Restaurant/data=!4m7!3m6!1s0x104e0b030c72142b:0x9559517bca71199e!8m2!3d9.0655594!4d7.4730514!16s%2Fg%2F1tlr1s1t!19sChIJKxRyDAMLThARnhlxyntRWZU?authuser=0&hl=en&rclk=1'
	// })
	// cluster.queue({
	// 	title: 'Cross Over',
	// 	url: 'https://www.google.com/maps/place/Crossover+Restaurant/data=!4m7!3m6!1s0x104e0af84981c07d:0x7d0c5fe4c6611419!8m2!3d9.0758239!4d7.4782613!16s%2Fg%2F11ckncqxbt!19sChIJfcCBSfgKThARGRRhxuRfDH0?authuser=0&hl=en&rclk=1'
	// })
	// cluster.queue({
	// 	title: 'Puzzo',
	// 	url: 'https://www.google.com/maps/place/Puzzo%E2%80%99s+Restaurant,+Abuja./data=!4m7!3m6!1s0x104e0b1e93d4e15f:0x5c55df4aa99d57bf!8m2!3d9.0805518!4d7.4856352!16s%2Fg%2F11fjmdznzh!19sChIJX-HUkx4LThARv1edqUrfVVw?authuser=0&hl=en&rclk=1'
	// })

	// Wait for cluster to idle and close it
	await cluster.idle()
	await cluster.close()
}

// getCompleteData()
