#pragma once

#include "../../../views/orm.view/view.hpp"
#include "../../../views/actions.view/view.hpp"
#include <memory>

struct OrmComponentReturn {
  std::shared_ptr<OrmView> instance;
};

class OrmComponent {
  public:
    static OrmComponentReturn init(std::shared_ptr<AbstractView> abstractMenu);
};

