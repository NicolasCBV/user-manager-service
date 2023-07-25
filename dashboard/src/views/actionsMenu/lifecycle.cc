#include "actionsMenu.view.h"

void ActionsMenu::lifeCycle() {

  while(this->life) {
    this->showOptions(this->options);
    this->watchKeyboard(this->options);
  }
}
