import './App.css';
import { useState } from 'react';

class matchProfile {
  constructor() {
    this.testPerson = '';
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

    breakLines.forEach(line => {
      if (line.includes(' and ') && this.testPerson === '') {
        this.testPerson = line;
      }
    });
    

    const closeIndex = breakLines.indexOf('Close Family');
    const extendedIndex = breakLines.indexOf('Extended Family');
    const distantIndex = breakLines.indexOf('Distant Family');

    console.log(closeIndex, extendedIndex, distantIndex);

    let closeFamilyStart = closeIndex + 1; 
    let closeFamilyFinish = extendedIndex;
    let extendedFamilyStart = extendedIndex + 1;
    let extendedFamilyFinish = distantIndex;
    let distantFamilyStart = distantIndex + 1;
    let distantFamilyFinish = breakLines.length - 1;

    let closeFamily = [];
    let extendedFamily = [];
    let distantFamily = [];

    if (closeIndex >= 0) {
      if (!extendedIndex) {
        if (!distantIndex) {
          closeFamilyFinish = breakLines.length - 1;
        } else {
          closeFamilyFinish = distantIndex;
        }
      }
      closeFamily = this.cleanUpMatchList(breakLines.slice(closeFamilyStart, closeFamilyFinish));
    }
    if (extendedIndex >= 0) {
      console.log('there is extended index');
      if (!distantIndex) {
        console.log('there is no distant index');
        extendedFamilyFinish = breakLines.length - 1;
      }
      extendedFamily = this.cleanUpMatchList(breakLines.slice(extendedFamilyStart, extendedFamilyFinish));
    }
    if (distantIndex >= 0) {
      distantFamily = this.cleanUpMatchList(breakLines.slice(distantFamilyStart, distantFamilyFinish));
    }
    console.log(closeFamilyStart, closeFamilyFinish);
    console.log(extendedFamilyStart, extendedFamilyFinish);
    console.log(distantFamilyStart, distantFamilyFinish);

    this.closeFamily = closeFamily;
    this.extendedFamily = extendedFamily;
    this.distantFamily = distantFamily;
    this.allMatches = [ ...closeFamily, ...extendedFamily, ...distantFamily ]
  }; 
    
}

function App() {
  const [ personOneInput, setPersonOneInput ] = useState();
  const [ personTwoInput, setPersonTwoInput ] = useState();

  const [ titleA, setTitleA ] = useState();
  const [ titleB, setTitleB ] = useState();

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

     setTitleA(person1.testPerson);
     setTitleB(person2.testPerson);

     setUniqueToPersonOne(uniqueToOne);
     setUniqueToPersonTwo(uniqueToTwo);
     setSharedMatches(shared);

  }

  function processPersons(e) {
    e.preventDefault();
    const personOne = new matchProfile();
    personOne.processMatches(personOneInput);

    const personTwo = new matchProfile();
    personTwo.processMatches(personTwoInput);

    personOne.shortenMatches();
    personTwo.shortenMatches();

    console.log(personOne);
    console.log(personTwo);

    compareMatches(personOne, personTwo);
  }

  return (
    <div>
      <header className="App-header">
      <h1>Unique Matches</h1>
      </header>
        <form>
          <div className='instructions'>
            <p>On Ancestry: Go to 'Shared Matches' on a Match's profile page.</p>
            <ol>
            <li>Copy all page contents (<span>cmd + A</span> on a Mac, or <span>ctl + A</span> on a PC).</li>
            <li>Paste into one of the text fields below (<span>cmd + V</span> on a Mac, or <span>ctl + V</span> on a PC).</li>
            <li>Repeat with a second Match's profile</li>
            <li>Click the 'Sort...' button.</li>
            </ol>
          </div>
          <div className='colGroup'>
            <div className='formColHalf'>
              <label>A: Paste contents of one 'Shared Matches' page
              <textarea onChange={setPersonOneInput}/>
              </label>
            </div>
            <div className='formColHalf'>
              <label>B: Paste contents of another 'Shared Matches' page
              <textarea onChange={setPersonTwoInput}/>
              </label>
            </div>
          </div>
          <button className='formBtn' onClick={processPersons}>Sort by shared and unique matches</button>
        </form>
      
      <div className='results'>
        <section>
          <h3>Unique to A</h3>
          <h4>{titleA}</h4>
          <ul>
            {uniqueToPersonOne.map((item, idx) => {
              return <li key={idx}>{item}</li>
            })}
          </ul>
        </section>
        <section>
          <h3>Shared by both A and B</h3>
          <ul>
            {sharedMatches.map((item, idx) => {
              return <li key={idx}>{item}</li>
            })}
          </ul>
        </section>
        <section>
          <h3>Unique to B</h3>
          <h4>{titleB}</h4>
          <ul>
            {uniqueToPersonTwo.map((item, idx) => {
              return <li key={idx}>{item}</li>
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}

export default App;
