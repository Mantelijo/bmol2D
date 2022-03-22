<?php
// Since flask does not work well with forgi, this php
// simply relays the requests to positions.py


if (!array_key_exists(key: "id", array: $_GET)) {
    exit(1);
}

$pdbId = $_GET['id'];

header('content-type: application/json');
echo shell_exec("python3 positions.py {$pdbId} 2>/dev/null");
