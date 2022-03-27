import io
import sys
import tempfile
from urllib.error import HTTPError
from Bio.PDB import PDBParser
import urllib

# latest forgi release from git
import forgi.threedee.utilities.pdb as ftup
import forgi.threedee.model.coarse_grain as ftmc

import numpy as np
import json
import RNA


def fasta_to_positions(bp_string):
    RNA.cvar.rna_plot_type = 1
    coords = RNA.get_xy_coordinates(bp_string)
    xs = np.array([coords.get(i).X for i in range(len(bp_string))])
    ys = np.array([coords.get(i).Y for i in range(len(bp_string))])

    return list(zip(xs, ys))


def main():
    if len(sys.argv) <= 1:
        print("Please provide pdb ID")
        exit(1)

    pdbId = sys.argv[1]
    return result(getPDBFile(pdbId))


def getPDBFile(pdbId):
    pdbId = pdbId.upper()
    url = "https://files.rcsb.org/download/{}.pdb".format(
        pdbId
    )

    response = None
    try:
        response = urllib.request.urlopen(url)
    except HTTPError as err:
        print(f"Toks PDB id neegzistuoja: HTTP {err.code}")
        exit(1)
    # Attempt to fetch pdb with provided id from rcsb
    if response.code != 200:
        print("Toks PDB id neegzistuoja")
        exit(1)

    out = tempfile.NamedTemporaryFile("w+b")
    out.write(response.read())
    out.seek(0)
    return out


def result(tempPdbFile):
    pdbparser = PDBParser()

    result = []
    pdbFilePath = tempPdbFile.name
    struct = pdbparser.get_structure("struct", pdbFilePath)
    for chain in struct.get_chains():
        if ftup.contains_rna(chain):
            # print(chain)
            cg = ftmc.load_cg_from_pdb(
                pdb_filename=pdbFilePath,
                chain_id=chain.id,
                parser=pdbparser,
                remove_pseudoknots=True,
            )
            dotBraket = cg.to_dotbracket_string()
            # positions = fasta_to_positions(dotBraket)
            # print(positions)

            result.append({
                "chain_id": chain.id,
                # "coords": positions,
                "dot_braket": dotBraket,
            })
    return json.dumps(result)


if __name__ == "__main__":
    from http.server import HTTPServer, BaseHTTPRequestHandler

    class HTTPHandler(BaseHTTPRequestHandler):
        def do_POST(self):

            length = self.headers["content-length"]
            pdbPayload = self.rfile.read(int(length))
            f = tempfile.NamedTemporaryFile("w+b")
            f.write(pdbPayload)
            f.seek(0)

            # attempt to generate data
            res = bytes(result(f), "utf-8")

            self.send_response(200)

            self.send_header('content-length', len(res))
            self.send_header("content-type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()

            self.wfile.write(res)
            self.wfile.flush()


    # print(main())

    httpd = HTTPServer(('localhost', 8001), HTTPHandler)
    print("Listening for secondary structure requests on http://localhost:8001")
    httpd.serve_forever()
