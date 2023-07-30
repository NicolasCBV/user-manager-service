#pragma once

#include "../../../views/main.view/view.hpp"
#include <memory>

struct MainMenuReturn {
  std::shared_ptr<MainView> instance;
};

class MainMenu {
  public:
    static MainMenuReturn init();
};
