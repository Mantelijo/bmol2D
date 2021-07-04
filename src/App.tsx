import React from 'react';
import { Viewer } from './components/Viewer';
import { DataFetcher } from './components/DataFetcher';

function App() {


  return (
    <div className="w-full flex flex-row">
      <div className="w-9/12 bg-indigo-300 min-h-full h-screen">
        <Viewer/>
      </div>
      <div className="w-3/12">
        <DataFetcher/>
      </div>
    </div>
  );
}


export default App;
