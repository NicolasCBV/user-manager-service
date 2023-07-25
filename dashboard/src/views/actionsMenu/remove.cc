#include "actionsMenu.view.h"
#include <ncurses.h>

void ActionsMenu::remove() {
  this->finish();
  this->life = false;
}
