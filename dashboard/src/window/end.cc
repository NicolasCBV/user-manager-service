#include <ncurses.h>

#include "./window-flow.h"

void WindowFlow::finish() {
  endwin();
}
