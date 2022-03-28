import json

from secondary_structure import getDotBraketStructures, getPDBFile

# File dirs assuming that we are executing this script in ./wasm directory
inFile = "pdbids_list"
outFile = "./../src/data/samples.json"

# Get list of pdb ids from pdbids_list file and generate json file with
# dotbraket structures for sample structures in bmol2d
with open(inFile, "r") as f:
    results = {}
    for line in f.readlines():
        pdbID = line.strip()
        print(f"Generating dotbraket structures for {pdbID}")

        try:
            s = getDotBraketStructures(getPDBFile(pdbID))
            results[pdbID] = s
        except:
            print(f"Could not load dot braket structures for {pdbID}")

    outputJson = json.dumps(results)

    with open(outFile, "w") as outF:
        outF.write(outputJson)
