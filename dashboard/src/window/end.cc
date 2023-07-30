#include <ncurses.h>

#include "./window.hpp"

void Window::finish() {
  endwin();
}
