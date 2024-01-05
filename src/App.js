import './App.css';
import { useState } from 'react';

class matchProfile {
  constructor() {
    this.closeFamily = [];
    this.extendedFamily = [];
    this.distantFamily = [];
    this.allMatches = [];
    this.matchNamesOnly = [];
  }

  cleanUpMatchList(matches) {
    let joinedLines = matches.join(' ');
    let cleanUp = joinedLines.split(' Do you recognize them? YesLearn more ');

    let finalCleanUp = []
    cleanUp.forEach(item => {
      if (item.includes(' View in tree View match ')) {
        let newArr = item.split(' View in tree View match ');
        finalCleanUp.push(...newArr);
      } else {
        finalCleanUp.push(item);
      }
    });

    let lastPattern = /^(Support Center)/
    if (lastPattern.test(finalCleanUp[finalCleanUp.length - 1])) {
        finalCleanUp.pop()
    }
      return finalCleanUp
  };

  shortenMatches(){
    let matchNames = this.allMatches.map(item => {
      let itemArr = item.split(' ');
      let regex = /(\dth)|(\1st)|(\2nd)|(\3rd)/;
      let index = null;
      itemArr.forEach((value,idx) => {
        if (regex.test(value) && !index) {
          index = idx;
        }
      });
      let justName = itemArr.splice(0, index).join(' ');
      return justName;
    });
    
    this.matchNamesOnly = matchNames;
  }
  
  processMatches(e) {
    let breakLines = e.target.value.trim().match(/[^\r\n]+/g).map(line => line.trim());

    const closeIndex = breakLines.indexOf('Close Family') || 0;
    const extendedIndex = breakLines.indexOf('Extended Family') || 0;
    const distantIndex = breakLines.indexOf('Distant Family') || 0;

    const closeFamily = this.cleanUpMatchList(breakLines.slice(closeIndex + 1, extendedIndex));
    const extendedFamily = this.cleanUpMatchList(breakLines.slice(extendedIndex + 1, distantIndex))
     const distantFamily = this.cleanUpMatchList(breakLines.slice(distantIndex + 1, breakLines.length - 1));

    this.closeFamily = closeFamily;
    this.extendedFamily = extendedFamily;
    this.distantFamily = distantFamily;
    this.allMatches = [ ...closeFamily, ...extendedFamily, ...distantFamily ]
  }; 
    
}

function App() {
  const [ personOneInput, setPersonOneInput ] = useState();

  const [ personTwoInput, setPersonTwoInput ] = useState();

  const [uniqueToPersonOne, setUniqueToPersonOne ] = useState([]);
  const [uniqueToPersonTwo, setUniqueToPersonTwo ] = useState([]);
  const [sharedMatches, setSharedMatches] = useState([]);

  function compareMatches(person1, person2) {

    let uniqueToOne = [];

    let uniqueToTwo = [];

    let shared = [];

    person1.matchNamesOnly.forEach((match, idx) => {
     if (person2.matchNamesOnly.includes(match)) {
      shared.push(person1.allMatches[idx]);
     } else {
      uniqueToOne.push(person1.allMatches[idx]);
     }
    });

    person2.matchNamesOnly.forEach((match, idx) => {
      if (!person1.matchNamesOnly.includes(match)) {
        uniqueToTwo.push(person2.allMatches[idx]);
      }
     });

     console.log(uniqueToOne);
     console.log(uniqueToTwo);
     console.log(shared);

  }

  function processPersons(e) {
    e.preventDefault();
    const personOne = new matchProfile();
    personOne.processMatches(personOneInput);

    const personTwo = new matchProfile();
    personTwo.processMatches(personTwoInput);

    personOne.shortenMatches();
    personTwo.shortenMatches();

    compareMatches(personOne, personTwo);
  }

  return (
    <div className="App">
      <header className="App-header">
        <form>
          <textarea onChange={setPersonOneInput}/>
          <textarea onChange={setPersonTwoInput}/>
          <button onClick={processPersons}>Sort by shared and unique matches</button>
        </form>
      </header>
    </div>
  );
}

export default App;
