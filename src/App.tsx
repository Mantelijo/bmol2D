import React from 'react';
import { Viewer } from './components/Viewer';
import { DataFetcher } from './components/DataFetcher';
import Spinner from './components/Spinner';
import {StoreComponent, context} from './Store'
import { useContext } from 'react';

function App() {

  const state = useContext(context)[0]

  return (
    <StoreComponent>
      <div className="w-full flex flex-row">
        {(state.isLoading === true) &&
          <div className="fixed w-screen min-h-screen top-0 left-0 flex items-center justify-center z-50" style={{backgroundColor:"rgba(0,0,0,0.35)"}}>
            <Spinner/>
          </div>
        }
        <div className="z-10 w-9/12 bg-indigo-300 min-h-full h-screen">
          <Viewer/>
        </div>
        <div className="z-10 w-3/12">
          <DataFetcher/>
        </div>
      </div>
    </StoreComponent>
  );
}


export default App;
