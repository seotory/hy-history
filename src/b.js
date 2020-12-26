const { log, clear } = console;

// 평가 지연이 안된 함수
let N = {}; // normal

N.range = function (start, end) {
    console.log('N.range()')
    let res = [];
    let isLoop = true;
    while(isLoop) {
        res.push(start++);
        if (start > end) {
            isLoop = false;
        } 
    }
    return res;
}

// 결과 역시 list 로 반환
N.map = function (f, list) {
    console.log('N.map()')
    let res = [];
    for (const a of list) {
        res.push(f(a))
    }
    return res;
}

// 결과역시 list 로 반환
N.filter = function (f, list) {
    console.log('N.filter()')
    let res = [];
    for (const a of list) {
        if (f(a)) {
            res.push(a);
        }
    }
    return res;
}

N.reduce = function (f, acc, list) {
    console.log('N.reduce()')
    if (arguments.length == 2) {
        list = acc;
        acc = list.length > 0 ? list[0] : null;
    }
    for (const a of list) {
        acc = f(acc, a);
    }
    return acc;
}

N.take = function(num, list) {
    let res = [];
    for (const a of list) {
        if(--num < 0) {
            return res;
        }
        res.push(a);
    }
}

N.go = function (list, ...fs) {
    return N.reduce((list, f) => f(list), list, fs);
}

N.curry = function (f) {
    return (a, ...b) => {
        // 즉시 실행
        if (b.length) {
          return f(a, ...b);  
        } 
        return (...others) => {
            return f(a, ...others);
        }
    }
}

/**
let pipeA = S.pipe(
    S.range(1,10),
    S.map(a=>a*a),
    S.filter(a=>a%2==1)
)
pipeA() // 함수 형태로 나옴.
 */
N.pipe = function (...fs) {
    return (list) => {
        return N.go(list, ...fs);
    }
}

// log(S.range(1,10));
// log(S.map(a=>a*a, new Set([1,2,3,4,5])));
// log(S.filter(a => a%2 == 1, [1,2,3,4,5,6,7,8]));
log(
    N.reduce((acc, a)=>acc+a, 0, 
        N.filter(a=>a%2==1, 
            N.map(a=>a*a, 
                N.range(1,10))))
);

log(',,,,,,');
log(
    N.take(3, N.range(1,100))
)

let addCurry = N.curry((a, b)=>a+b);
log(addCurry(3)(4));
log(addCurry(31)(4));

log('======');
N.go(
    N.range(1,10),
    list => N.map(a => a * a, list),
    list => N.filter(a => a % 2 == 1, list),
    list => N.reduce((acc, a) => acc + a, list),
    log
)

// 여기서 캐리로 한번 감싸주면..!
let C = {
    map: N.curry(N.map),
    filter: N.curry(N.filter),
    reduce: N.curry(N.reduce)
}

N.go(
    N.range(1,10),
    C.map(a => a * a),
    C.filter(a => a % 2 == 1),
    C.reduce((acc, a) => acc + a),
    log
)

let pipeA = N.pipe(
    C.map(a => a * a),
    C.filter(a => a % 2 == 1),
    C.reduce((acc, a) => acc + a),
    log
)
pipeA(N.range(1,20));
pipeA(N.range(1,5));

// 여기까지는 즉시 평가 함수형...!!
log('=======');

let L = {}; // lazy
let S = {}; // 짧게
L.range = function* (start, end) {
    while(start < end) {
        yield start;
        start++;
    }
    return;
}

L.map = function* (f, iter) {
    for (const a of iter) {
        yield f(a);
    }
}

L.filter = function* (f, iter) {
    for (const a of iter) {
        if (f(a)) {
            yield a;
        }
    }
}

L.each = function (f, iter) {
    for (const a of iter) {
        f(a);
    }
}

L.reduce = function (f, acc, iter) {
    if (arguments.length == 2) { // acc 생략시...
        iter = acc;
        acc = iter.next().value;
    }
    console.log(iter);
    for (const a of iter) {
        acc = f(acc, a);
    }
    return acc;
}


let iter = L.range(1,3);
for (const a of iter) {
    log(a);
}

let iter2 = L.map(a=>a*a, L.range(1,10));
log(iter2.next().value)
log(iter2.next().value)
log(iter2.next().value)

let iter3 = L.filter(a=>a%2==1, iter2);
log(iter3.next().value);

clear();

log(
    L.reduce((acc, a)=>acc+a,  
        L.filter(a=>a%2==1,
            L.map(a=>a+10, 
                L.range(1, 20))))
);

L.each(log,  
    L.filter(a=>a%2==1,
        L.map(a=>a, 
            L.range(1, 10))))
;
// clear();

let test = function*() {
    yield [1,2,3,4,5];
}
// for (const a of test()) {
//     console.log(a);
//     for (const b of a) {
//         console.log(b);
//     }
// }