const groupRec = require('./groupRecommendation.js');
const fs = require('fs');

test('Correct finalArray', async () =>{
    const ffs = await fs.readFileSync('./testGroup.json', async (error) => {
        if (error) console.log(error);
    });

    const parsedFfs = JSON.parse(ffs);

    const f = await groupRec.makeGroupRec(parsedFfs);

    expect(f.length).toBe(10);
    
});