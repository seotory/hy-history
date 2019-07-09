import 'colors';
import Axios from 'axios';

log('조회중....');

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getRandomIntInclusive(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function log(...args: any) {
    console.log(...args);
}

async function search(no: number, name: any, type: any, price1: any, price2: any) {

    let apiUrl = `https://new.land.naver.com/api/articles/complex/${no}?realEstateType=APT%3AABYG%3AJGC&tradeType=A1&tag=%3A%3A%3A%3A%3A%3A%3A%3A&rentPriceMin=0&rentPriceMax=900000000&priceMin=0&priceMax=900000000&areaMin=0&areaMax=900000000&oldBuildYears&recentlyBuildYears&minHouseHoldCount&maxHouseHoldCount&showArticle=false&sameAddressGroup=true&minMaintenanceCost&maxMaintenanceCost&priceType=RETAIL&directions=&complexNo=109412&buildingNos=&areaNos=&type=list&order=rank`;

    let fullList = [];
    let number = 1;
    let isMoreData = true;
    while(isMoreData) {

        let fullApiUrl = apiUrl + `&page=${number}`;
        let response = await Axios.get(fullApiUrl);
        await sleep(getRandomIntInclusive(200, 2000));

        let data = response.data;
        fullList.push(...data.articleList);

        // for loop 
        isMoreData = data.isMoreData;
        number ++;
    }

    log(`[${name}] 총 ${fullList.length}건 `);
    log(`---------------------------------------------`)
    await sleep(1000);
    fullList.forEach((data) => {
        // log(data);
        let priceInfo = data.dealOrWarrantPrc.split('억');
        let price = Number(priceInfo[0].replace(/[^0-9]/g, '')*10000) +
                    Number(priceInfo[1] ? priceInfo[1].replace(/[^0-9]/g, '') : 0);

        let typeMarker = (data.areaName.indexOf(type) > -1) ? '✨ ' : '';
        
        let logText = `${typeMarker}${data.buildingName} ${data.floorInfo}층 ${data.areaName}타입 ${data.dealOrWarrantPrc}원 | ${data.realtorName}, ${data.cpPcArticleUrl}`;
        if (price <= price1) {
            log(logText.red);
        } else if (price <= price2) {
            log(logText.blue);
        } else {
            log(logText.gray);
        }
    }) 
}

(async () => {
    await search(109412, '힐스', '87A', 51000, 52000);
    // await search(109929, '라온', '85A',41000, 43000);
})()
