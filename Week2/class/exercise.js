// const ex1 = {
//   name: 'Ramzi',
//   sayHello: function() {
//     console.log('Hi, my name is ' + this.name);
//   },
// };
// ex1.sayHello(); // what does it log? // Hi, my name is Ramzi
// const ex2 = ex1;
// ex2.name = 'Stas';
// ex2.sayHello(); // what does it log? // Hi, my name is Stas
// ex1.sayHello(); // what does it log? // Hi, my name is Stass
// ex2.makeHelloSayer = function() {
//   return otherName => {
//     console.log(`Hi ${otherName}, my name is ${this.name}`);
//   };
// };
// ex2.makeHelloSayer()('Noer'); // what does it log? // Hi Noer, my name is Stas

// ex1.sayHello = ex2.makeHelloSayer();
// ex1.sayHello('ahmet'); // what does it log?
// ex1.sayHello('Johan'); // what does it log?

// var name = 'ahmet yasin';

function runFunctionOnObject(obj, fn, arg) {
  obj.fn = fn;
  obj.fn(arg);
}
runFunctionOnObject(
  { name: 'Kelley' },
  function(otherName) {
    console.log('Hi ' + otherName + ', my name is ', this.name);
  },
  'Stas',
);
runFunctionOnObject(
  { name: 'Kelley' },
  otherName => {
    console.log('Hi ' + otherName + ', my name is ', this.name);
  },
  'Stas',
);
