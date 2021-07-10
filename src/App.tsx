import React, { useState } from 'react';
import { Viewer } from './components/Viewer';
import { DataFetcher } from './components/DataFetcher';
import { Polymer } from './lib/format/atoms';

function App() {

  let [polymers, setPolymer] = useState<Polymer[]>([])

  return (
    <div className="w-full flex flex-row">
      <div className="w-9/12 bg-indigo-300 min-h-full h-screen">
        <Viewer polymers={polymers}/>
      </div>
      <div className="w-3/12">
        <DataFetcher  setPolymers={setPolymer}  />
      </div>
    </div>
  );
}


export default App;
