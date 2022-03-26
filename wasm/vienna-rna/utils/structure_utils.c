
#include <stdlib.h>
#include <limits.h>
#include <string.h>

#include "basic.h"
#include "structure.h"

inline int extract_pairs(short       *pt,
              const char  *structure,
              const char  *pair)
{
  const char    *ptr;
  char          open, close;
  short         *stack;
  unsigned int  i, j, n;
  int           hx;

  n     = (unsigned int)pt[0];
  stack = (short *)vrna_alloc(sizeof(short) * (n + 1));

  open  = pair[0];
  close = pair[1];

  for (hx = 0, i = 1, ptr = structure; (i <= n) && (*ptr != '\0'); ptr++, i++) {
    if (*ptr == open) {
      stack[hx++] = i;
    } else if (*ptr == close) {
      j = stack[--hx];

      if (hx < 0) {
        vrna_message_warning("%s\nunbalanced brackets '%2s' found while extracting base pairs",
                             structure,
                             pair);
        free(stack);
        return 0;
      }

      pt[i] = j;
      pt[j] = i;
    }
  }

  free(stack);

  if (hx != 0) {
    vrna_message_warning("%s\nunbalanced brackets '%2s' found while extracting base pairs",
                         structure,
                         pair);
    return 0;
  }

  return 1; /* success */
}

short * vrna_ptable_from_string(const char    *string)
{
  char          pairs[3];
  short         *pt;
  unsigned int  i, n;

  n = strlen(string);

  if (n > SHRT_MAX) {
    vrna_message_warning("vrna_ptable_from_string: "
                         "Structure too long to be converted to pair table (n=%d, max=%d)",
                         n,
                         SHRT_MAX);
    return NULL;
  }

  pt    = (short *)vrna_alloc(sizeof(short) * (n + 2));
  pt[0] = (short)n;


  if ((!extract_pairs(pt, string, "()"))) {
    free(pt);
    return NULL;
  }

  return pt;
}


short * vrna_ptable(const char *structure)
{
  return vrna_ptable_from_string(structure);
}
