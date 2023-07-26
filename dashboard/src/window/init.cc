#include <cstdlib>
#include <ncurses.h>
#include "./window.hpp"

void Window::init() {
  initscr();
  curs_set(0);
  clear();
  cbreak();
  noecho();
  keypad(stdscr, true);
}
