import React, { useState } from 'react';
import { Viewer } from './components/Viewer';
import { DataFetcher } from './components/DataFetcher';
import { Atom } from './lib/format/atoms';

function App() {

  let [atoms, setAtom] = useState<Atom[]>([])

  return (
    <div className="w-full flex flex-row">
      <div className="w-9/12 bg-indigo-300 min-h-full h-screen">
        <Viewer atoms={atoms}/>
      </div>
      <div className="w-3/12">
        <DataFetcher atoms={atoms} setAtoms={setAtom}  />
      </div>
    </div>
  );
}


export default App;
