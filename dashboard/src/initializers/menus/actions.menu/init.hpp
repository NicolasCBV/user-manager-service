#pragma once

#include "../../../views/actions.view/view.hpp"
#include "../../../views/orm.view/view.hpp"
#include <memory>

struct ActionsMenuReturn {
  std::shared_ptr<ActionsView> actionInstance;
  std::shared_ptr<OrmView> ormInstance;
};

class ActionsMenu {
  public:
    static ActionsMenuReturn init();
};
