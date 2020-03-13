const parse = require ('csv-parse')
const output = [];

// Create the parser
const parser = parse({
    delimiter: ','
})

// Use the readable stream api
parser.on('readable', function() {
    let record;
    while (record = parser.read()) {
        output.push(record);
        console.log(record);
    }
});

// Catch any error
parser.on('error', function(err) {
    console.log(err.message);
});

parser.write("./../../dataset/ml-latest-small/movies.csv");

parser.end();
console.log(output);