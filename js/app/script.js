const population =50;
const crossOverProbability = 0.9;
const mutationProbability = 0.1;
const maxRange = 255;
const resultSpan=document.getElementById("resultSpan")

let generation = 0;
let chromosomes = new Array(population);
let fitnesses = new Array(population);

const fittnessFunc = x => {
    return Math.pow(x, 2);
};

const crossingOver = (x, y) => {
    const crossPoint = Math.floor(Math.random() * (x.length - 1)) + 1;
    let child1 = x.substring(0, crossPoint) + y.substring(crossPoint, y.length);
    let child2 = y.substring(0, crossPoint) + x.substring(crossPoint, x.length);
    return [child1, child2];
};

const mutation = (x) => {
    const mutationPoint = Math.floor(Math.random() * x.length);
    let chromosomeArray = x.split("");
    if (chromosomeArray[mutationPoint] === '1')
        chromosomeArray[mutationPoint] = '0';
    else
        chromosomeArray[mutationPoint] = '1';
    return chromosomeArray.join("");
};

let fitnessData = [];

let maxFitnesses = [];

function theMethod() {
    
    for (let i = 0; i < population; i++) {
        chromosomes[i] = Math.floor(Math.random() * (maxRange + 1)); // بین 0 تا 255
        fitnesses[i] = fittnessFunc(chromosomes[i]);
        chromosomes[i] = chromosomes[i].toString(2).padStart(8, '0');
    }

    let crossCount = Math.floor((population / 2) * crossOverProbability);
    let flag = true;

    while (flag) {
        let newPopulation = [];
        let selectedParents = new Set();
        
        let maxfitt = Math.max(...fitnesses);
        let elitisimIndex = fitnesses.indexOf(maxfitt);

        for (let i = 0; i < crossCount; i++) {
            let indexes = new Set();

            while (indexes.size < 4) {
                let randIndex = Math.floor(Math.random() * chromosomes.length);

                if (!selectedParents.has(randIndex) && randIndex !== elitisimIndex) {
                    indexes.add(randIndex);
                }
            }

            let [indexOfFirst, indexOfSecond, indexOfThird, indexOfFourth] = [...indexes];

            let firstBigIndex = fitnesses[indexOfFirst] >= fitnesses[indexOfSecond] ? indexOfFirst : indexOfSecond;
            let secondBigIndex = fitnesses[indexOfThird] >= fitnesses[indexOfFourth] ? indexOfThird : indexOfFourth;

            selectedParents.add(firstBigIndex);
            selectedParents.add(secondBigIndex);

            const [child1, child2] = crossingOver(chromosomes[firstBigIndex], chromosomes[secondBigIndex]);
            newPopulation.push(child1, child2);
        }

        chromosomes.forEach((chromosome, index) => {
            if (!selectedParents.has(index)) {
                newPopulation.push(chromosome);
            }
        });

        let mutationCount = Math.floor(newPopulation.length * mutationProbability);
        let availableIndices = Array.from({ length: newPopulation.length }, (_, i) => i);

        for (let i = 0; i < mutationCount; i++) {
            let randomIndex = Math.floor(Math.random() * availableIndices.length);
            let selectedIndex = availableIndices[randomIndex];
            newPopulation[selectedIndex] = mutation(newPopulation[selectedIndex]);
            availableIndices.splice(randomIndex, 1);
        }

        chromosomes = [...newPopulation];

        for (let i = 0; i < population; i++) {
            chromosomes[i] = parseInt(chromosomes[i], 2);
            fitnesses[i] = fittnessFunc(chromosomes[i]);
            chromosomes[i] = chromosomes[i].toString(2).padStart(8, '0');
        }

        let maxfittness = Math.max(...fitnesses);

        let tedadYeksan=30

        maxFitnesses.push(maxfittness);

        resultSpan.innerHTML=maxfittness

        fitnessData.push(maxfittness);

        if (maxFitnesses.length >= tedadYeksan) { 
            let recentFitnesses = maxFitnesses.slice(-tedadYeksan);
            if (recentFitnesses.every(fit => fit === recentFitnesses[0])) {
                flag = false;
            }
        }

        generation++;

        // if (generation == 500) {
        //     flag = false;
        // }
    }

    const ctx = document.getElementById('fitnessChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({ length: fitnessData.length }, (_, i) => i + 1), 
            datasets: [{
                label: 'Fitness Over Generations',
                data: fitnessData,
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false,
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

theMethod();