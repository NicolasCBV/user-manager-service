#include <ncurses.h>
#include "./window-flow.h"

void WindowFlow::init() {
  initscr();
  curs_set(0);
  clear();
  cbreak();
  noecho();
  keypad(stdscr, true);
}
