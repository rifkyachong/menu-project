let teststr = "teh juruk";
let value = " teh  jeruk manGGa ";
let regex = "(\\b" + value.trim().toLowerCase().replace(/\s+/g, "|\\b") + ")"
regex = new RegExp(regex, 'i');
let result = regex.test(teststr);
console.log(result);