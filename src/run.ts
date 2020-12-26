import 'colors';
import Axios from 'axios';
import * as R from 'remeda';
import { america } from 'colors';

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getRandomIntInclusive(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const {log, clear, dir} = console;
/**
 * 함수형으로 간다면...->
 * api 조회 -> data 리턴
 * 함수 축척
 */


// function
interface Option {
    articleNo?: number;
    title?: string,
    types: {
        [key: string]: {
            lessThenPrice1: number,
            lessThenPrice2: number,
        };
    }
};
let option: Option = {
    articleNo: 109412,
    title: '힐스',
    types: {
        '87A' : {
            lessThenPrice1: 51000,
            lessThenPrice2: 52000,
        },
        '96' : {
            lessThenPrice1: 59000,
            lessThenPrice2: 60000,
        },
        '110B' : {
            lessThenPrice1: 68000,
            lessThenPrice2: 70000,
        },
        '111A' : {
            lessThenPrice1: 68000,
            lessThenPrice2: 70000,
        }
    }
}
async function search(option: Option) {

    let apiUrl = `https://new.land.naver.com/api/articles/complex/${option.articleNo}?realEstateType=APT%3AABYG%3AJGC&tradeType=A1&tag=%3A%3A%3A%3A%3A%3A%3A%3A&rentPriceMin=0&rentPriceMax=900000000&priceMin=0&priceMax=900000000&areaMin=0&areaMax=900000000&oldBuildYears&recentlyBuildYears&minHouseHoldCount&maxHouseHoldCount&showArticle=false&sameAddressGroup=true&minMaintenanceCost&maxMaintenanceCost&priceType=RETAIL&directions=&complexNo=109412&buildingNos=&areaNos=&type=list&order=rank`;

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

    log(`[${option.title}] 총 ${fullList.length}건 `);
    log(`---------------------------------------------`)
    await sleep(1000);
    fullList.forEach((data) => {
        // log(data);
        let priceInfo = data.dealOrWarrantPrc.split('억');
        let price = Number(priceInfo[0].replace(/[^0-9]/g, '')*10000) +
                    Number(priceInfo[1] ? priceInfo[1].replace(/[^0-9]/g, '') : 0);

        let type = option.types[data.areaName];

        // let typeMarker = (data.areaName.indexOf(type) > -1) ? '✨ ' : '';
        
        let logText = `${data.articleStatus=='R1'?'[거래완료]':''}${data.buildingName} ${data.floorInfo}층 ${data.areaName}타입 ${data.dealOrWarrantPrc}원 | ${data.realtorName}, ${data.cpPcArticleUrl} | https://m.land.naver.com/article/info/${data.articleNo} [${data.articleFeatureDesc}]`;
        if (type && price <= type.lessThenPrice1) {
            log(logText.red);
        } else if (type && price <= type.lessThenPrice2) {
            log(logText.blue);
        } else {
            log(logText.gray);
        }
    })
}

(async () => {
    await search(option);
    // await search(109929, '라온', '85A',41000, 43000);
})()

// const get = (v: any) => v instanceof Promise ? v.then(_=>_) : v;

// // iterator
// async function* api (option: Option, startNum: number) {
//     let pageNum = startNum;
//     let isLoop = true;
//     while(isLoop) {
//         await sleep(getRandomIntInclusive(200, 2000));
//         let apiUrl = `https://new.land.naver.com/api/articles/complex/${option.articleNo}?realEstateType=APT%3AABYG%3AJGC&tradeType=A1&tag=%3A%3A%3A%3A%3A%3A%3A%3A&rentPriceMin=0&rentPriceMax=900000000&priceMin=0&priceMax=900000000&areaMin=0&areaMax=900000000&oldBuildYears&recentlyBuildYears&minHouseHoldCount&maxHouseHoldCount&showArticle=false&sameAddressGroup=true&minMaintenanceCost&maxMaintenanceCost&priceType=RETAIL&directions=&complexNo=109412&buildingNos=&areaNos=&type=list&order=rank&page=${pageNum++}`;
//         console.log(apiUrl);
//         const res = await Axios.get(apiUrl);
//         if(res.data && res.data.isMoreData) {
//         } else {
//             isLoop = false;
//         }
//         yield res.data;
//     }
//     return;
// }
// type anyF = (...args: any[]) => any;

// let A: any = {};

// let takeValue = (val: any, f: anyF) => val instanceof Promise ? val.then(f) : f(val);

// A.map = function* (f: anyF, iter: IterableIterator<any>[]) {
//     console.log(iter);
//     for (const a of iter) {
//         yield takeValue(a, f);
//     }
// }

// A.reduce = function* (f: anyF, acc: any, iter: IterableIterator<any>[]) {
//     for (const a of iter) {
//         yield acc = f(acc, a);
//         // yield acc = 
//     }
// }

// A.each = function (f: anyF, iter: Iterable<any>[]) {
//     for (const a of iter) {
//         // f(a);
//         takeValue(a, f);
//     }
// }

// A.go = function (iter: IterableIterator<any>[], ...fs: anyF[]) {
//     return A.reduce((iter: IterableIterator<any>, f: anyF) => f(iter) , iter, fs);
// }

// let test = api(option, 1);
// // console.dir(test.next().then((val: any) => console.log(val)));

// A.each(log, api(option, 1));


// const main = async () => {
//     // await A.map((a: any)=>a, api(option, 1));
//     await A.go(
//         api(option, 1),
//         (iter: IterableIterator<any>) => A.map((a: any)=>a, iter),
//         (iter: IterableIterator<any>) => A.each(log, iter),
//     )
// }
// async () => {
//     await main();
// }



// const curry = (f: anyF) => {
//     return (one: any, ...rest: any) => {
//         return rest.length < 1 
//             ? (...rest: any) => f(one, ...rest) 
//             : f(one, ...rest);
//     }
// }

// let A = {} as any;
// A.map = async function* (f: anyF, iter: AsyncIterableIterator<any>) {
//     for await (const a of iter) {
//         yield f(a);
//     }
// }

// A.reduce = async (f: anyF, acc: any, iter: AsyncIterableIterator<any>) => {
//     for await (const a of iter) {
//         acc = f(acc, a);
//     }
//     return acc;
// }

// A.each = async function (f: anyF, iter: AsyncIterableIterator<any>) {
//     for await (const a of iter) {
//         f(a);
//     }
// }
// // A.loop = function* (list: ) {
// //     for ()
// // }

// // A.makeAry = async function* (f: anyF, iter: AsyncIterableIterator<any>) {
// //     for await (const a of iter) {
        
// //     }
// // }

// A.go = async (iter: AsyncIterableIterator<any>, ...fs: any[]) => {
//     return A.reduce((acc: any, f: anyF) => f(acc), iter, fs);
//     // A.reduce(f, [1,2,3,4,5], mapF);
//     // 
// }

// A.loop = (f: anyF, iter: []) => {
//     console.dir(iter);
//     for (const a of iter) {
//         f(a);
//     }
// }


// console.clear();

// // A.log(
// //     A.map((a:number) => a * a, 
// //         A.map((a:number)=> a - 1, 
// //             [1,2,3,4,5])));

// const main = async () => {
//     let acc = (acc: any[], value: any) => acc.concat(value && value.articleList ? value.articleList : null);

//     let log = (data: any) => {
//         let logText = `${data.articleStatus=='R1'?'[거래완료]':''}${data.buildingName} ${data.floorInfo}층 ${data.areaName}타입 ${data.dealOrWarrantPrc}원 | ${data.realtorName}, ${data.cpPcArticleUrl} | https://m.land.naver.com/article/info/${data.articleNo} [${data.articleFeatureDesc}]`;
//         let priceInfo = data.dealOrWarrantPrc.split('억');
//         let price = Number(priceInfo[0].replace(/[^0-9]/g, '')*10000) +
//                     Number(priceInfo[1] ? priceInfo[1].replace(/[^0-9]/g, '') : 0);

//         let type = option.types[data.areaName];
//         if (type && price <= type.lessThenPrice1) {
//             log(logText.red);
//         } else if (type && price <= type.lessThenPrice2) {
//             log(logText.blue);
//         } else {
//             log(logText.gray);
//         }
//     }

//     const a = await A.go(
//         api(option, 1),
//         (iter: any) => A.map((data: any) => data.articleList, iter),
//         (iter: any) => A.loop(log, iter),
//         // (iter: any) => log(iter)
//         // (iter: any) => A.reduce((acc: any[], value:any) => acc.concat(value), [], iter),
//         // (iter: any) => A.map((a:any) => A.log(a), iter)
//     )
//     log(a.length);
// }
// main();