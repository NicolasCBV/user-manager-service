#include "./window.hpp"
#include <cstring>
#include <ncurses.h>

void Window::writeCentralizedText(const char* text) {
  int ymax, xmax;
  getmaxyx(stdscr, ymax, xmax);

  clear();
  mvprintw((ymax/2), (xmax/2 - std::strlen(text)/2), "%s", text);
  refresh();
}
