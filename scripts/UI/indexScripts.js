
import { GetFlowers, updateFlowersList } from './script.js';

var flowersDiv = document.getElementById("flowersdiv");
var flowersList = GetFlowers();
var flowersIndex = flowersList.slice(0, 6);

updateFlowersList(flowersDiv, flowersIndex);