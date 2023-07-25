#include "ormMenu.view.h"
#include <ncurses.h>

void OrmMenu::remove() {
  this->finish();
  this->life = false;
}
