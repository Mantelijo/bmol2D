#include <stdlib.h>
#include <string.h>

#include "utils/basic.h"
#include "utils/structure.h"
#include "naview.h"

typedef struct {
  float X;  /* X coords */
  float Y;  /* Y coords */
} COORDINATE;

// This method must be exported when compiling to wasm
COORDINATE* secondaryStruct(char *structure){
    int i;
    short *table = vrna_ptable(structure);
    short length = (short) strlen(structure);

    COORDINATE *coords = (COORDINATE *) vrna_alloc((length+1)*sizeof(COORDINATE));
    float *X = (float *) vrna_alloc((length+1)*sizeof(float));
    float *Y = (float *) vrna_alloc((length+1)*sizeof(float));
    naview_xy_coordinates(table, X, Y);

    for(i=0;i<=length;i++){
      coords[i].X = X[i];
      coords[i].Y = Y[i];
    }
    free(table);
    free(X);
    free(Y);
    return coords;
}

// Just a test
int main(){
  char* dot = "((((((((((..(((((..((((((((((....))))).))))).............((((......((((((((((.....)))))(((((....)))))((...(((((.............(((((((((((....)))))))))..)).......((((((.......))))))..(((((((....)))))))....)))..)))))))))))))...((((.....((((...(((........)))....)))).....))))......((((((((....))))))))...........))))).....................))))))))))....";
  size_t len = strlen(dot);

  COORDINATE* c = secondaryStruct(dot);
  
  for (int i=0; i<(int)len;i++){
    printf("x:%f y:%f \n", c[i].X, c[i].Y);
  }

  return 0;
}

