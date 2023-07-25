#include "mainMenu.view.h"
#include <ncurses.h>

void MainMenu::remove() {
  this->finish();
  this->life = false;
}
