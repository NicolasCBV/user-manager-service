#include "ormMenu.view.h"

void OrmMenu::lifeCycle() {
  while(this->life) {
    this->showOptions(this->options);
    this->watchKeyboard(this->options);
  }
}
