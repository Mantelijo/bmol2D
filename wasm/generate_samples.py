import json

from threading import Thread
from secondary_structure import getDotBraketStructures, getPDBFile

# File dirs assuming that we are executing this script in ./wasm directory
inFile = "pdbids_list"
outFile = "./../src/data/samples.json"

NUM_THREADS = 12
results = {}


threads = []


def runThread(pdbID):
    if len(threads) < NUM_THREADS:
        t = Thread(target=run, args=(pdbID))
        t.start()
        print(f"started thread {t.native_id}")
        threads.append(t)
    else:
        for t in threads:
            t.join()
            print(f"thread {t.native_id} finished")
            threads.remove(t)
        # Attempt to run again
        runThread(pdbID)


def run(pdbID):
    try:
        results[pdbID] = getDotBraketStructures(getPDBFile(pdbID))
    except:
        print(f"Could not load dot braket structures for {pdbID}")
        raise

    # Get list of pdb ids from pdbids_list file and generate json file with
    # dotbraket structures for sample structures in bmol2d
with open(inFile, "r") as f:
    for line in f.readlines():
        pdbID = line.strip()
        print(f"Generating dotbraket structures for {pdbID}")
        run(pdbID)

    outputJson = json.dumps(results)

    with open(outFile, "w") as outF:
        outF.write(outputJson)
