// push 가 없고 평가가 추후에 이루어지기 때문에 메모리의 이점이 있음.
let L = {};
L.map = function* (f, iter) {
    for (const a of iter) {
        yield f(a);
    }
}
L.filter = function* (f, iter) {
    for (const a of iter) {
        if (f(a)) yield a;
    }
}
L.range = function* (start, stop) {
    while(start < stop) yield start++;
}
L.take = function* (l, iter) {
    for (const a of iter) {
        yield a;
        if(--l == 0) break;
    }
}

const iterableFunctionMaker = gf => (...args) => [...gf(...args)];
console.log(iterableFunctionMaker(L.map)(a => a+2, [1,2,3,4]));

var it2 = L.range(1,5);
it2.next();


var it = L.take(15,
    L.filter(a => a % 2 == 1, 
        L.map(a => a*a, 
            L.range(1, 10000))))

for (const a of it) {
    console.log(a);
}

const reduce = (f, acc, iter) => {
    for (const a of iter) {
        acc = f(acc, a);
    }
    return acc;
}
L:map;