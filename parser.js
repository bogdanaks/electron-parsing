const request = require('request-promise')
const $ = require('cheerio')

module.exports = {
    foo: (tag, page1, page2) => {
        return new Promise((resolve, reject) => {
            const getImages = (tag, page) => {
                const url = `https://openclipart.org/tag/${tag}?p=${page}&query=${tag}`
                const res = request(url)
                    .then((html) => {
                        let count = $('.artwork > a > img', html).length
                        let links = []
                        for (let i = 0; i < count; i++) {
                            let hrefA = $('.artwork > a', html)[i].attribs.href
                            let srcImg = $('.artwork > a > img', html)[i].attribs.src
                            let imgNum = srcImg.split('/')[srcImg.split('/').length - 1]
                            let hrefName = hrefA.split('/')[hrefA.split('/').length - 1]
                            let link = `https://openclipart.org/image/800px/svg_to_png/${imgNum}/${hrefName}.png`
                            links.push(link)
                        }
                        return links
                    })
                    .catch((err) => console.log(err))
                return res
            }

            ;(async () => {
                if (page2 === 0 || page2 <= page1) {
                    const res = await getImages(tag, page1)
                    resolve(res)
                } else {
                    let arrRes = []
                    for (let i = page1; i <= page2; i++) {
                        let res = await getImages(tag, i)
                        arrRes = arrRes.concat(res)
                    }
                    resolve(arrRes)
                }
            })()
        })
    },
}
