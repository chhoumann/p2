const groupRec = require('./groupRecommendation.js');
const fs = require('fs');

async function getTestData(){
    const group = await fs.readFileSync('./testGroup.json', async (error) => {
        if (error) console.log(error);
    });
    
    const parsedGroup = JSON.parse(group);
    
    return await groupRec.makeGroupRec(parsedGroup);
}

(async () => finalArray = await getTestData())();

test('Correct finalArray', async () =>{
    const finalArray = await getTestData()

    expect(finalArray.length).toBe(10);
    
});

test('max value of topArray is number 1 in final array', async () => {
    const finalArray = await getTestData()
    
    expect(Math.max(...groupRec.topArray)).toBe(finalArray[0]["correlation"]);    
})

test('Correct ordered correlations', async () => {
    const finalArray = await getTestData();
    for (let i = 0; i < finalArray.length - 1; i++){
        expect(finalArray[i]["correlation"] >= finalArray[i+1]["correlation"]).toBe(true);
    }
})

