function log(...args) {
    console.log(...args);
}

// push 가 없고 평가가 추후에 이루어지기 때문에 메모리의 이점이 있음.
var L = {};
L.map = function* (f, iter) {
    for (const a of iter) {
        yield f(a);
    }
}
L.map = function(f, iter) {
    return {
        next: function() {
            var cur = iter.next();
            return cur.done 
                ? {done: true}
                : {
                    value: f(cur.next()),
                    done: false
                }
        }
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
// es5
L.range = function(start, stop) {
    return {
        next: function () {
            return start < stop ? {
                value: start++,
                done: false
            } : {
                done: true
            }
        },
        [Symbol.iterator]() {
            return this;
        }
    }
}
L.take = function* (l, iter) {
    for (const a of iter) {
        yield a;
        if(--l == 0) break;
    }
}
// es 5
L.take = function(l, iter) {
    var res = [];
    while(true) {
        var cur = iter.next();
        if (cur.done) break;
        var a = cur.value;
        res.push(a);
        if (--l == 0) break;
    }
    return res;
}

// const iterableFunctionMaker = gf => (...args) => [...gf(...args)];
// console.log(iterableFunctionMaker(L.map)(a => a+2, [1,2,3,4]));

var it2 = L.range(1,5);
it2.next();


var it = L.take(15,
    L.filter(a => a % 2 == 1, 
        L.map(a => a*a, 
            L.range(1, 10000))))

for (const a of it) {
    console.log(a);
}

var reduce = (f, acc, iter) => {
    for (const a of iter) {
        acc = f(acc, a);
    }
    return acc;
}


const arr = [1,2,3];
for (const a of arr) log(a);
// 단계적 분석
const iteretor = arr[Symbol.iterator]();
while (true) {
    const {value, done} = iteretor.next();
    if (done) break;
    log(value);
}

function* empty() {}
function safety(iter) {
    return iter && iter[Symbol.iterator] ? iter : empty()
}
function reduce(f, acc, iter) {
    if (arguments.length == 2) {
        iter = acc[Symbol.iterator]();
        acc = iter.next().value;
    }
    for (const a of iter) {
        acc = f(acc, a);
    }
    return acc;
}
// log(reduce(add, 0, [1,2,3]));

const count = iter => reduce((obj, v) => {
    obj[v] = (obj[v] || 0) + 1;
    return obj;
}, {}, iter);

log(count([1,2,3,4,5,6,1,2,3]));