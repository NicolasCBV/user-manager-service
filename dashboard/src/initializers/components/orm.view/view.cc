#include "view.hpp"
#include "../../../checks/header.hpp"
#include "../../../services/defineORM.hpp"
#include <chrono>
#include <ios>
#include <thread>

void setORM(std::shared_ptr<OrmView> genericView, bool isPrisma) {
  const char* msg = "Loading files...";
  Window::writeCentralizedText(msg);
  std::this_thread::sleep_for(std::chrono::milliseconds(1000));

  try {
    DefineORM::exec(isPrisma);
  } catch(std::ios_base::failure& err) {
    const char* msg = err.what();
    Window::writeCentralizedText(msg);
    std::this_thread::sleep_for(std::chrono::milliseconds(2500));

    genericView->lifecycle();
    return;
  }

  genericView->lifecycle();
}

OrmComponentReturn OrmComponent::init(std::shared_ptr<AbstractView> abstractMenu) {
  std::shared_ptr<OrmView> ormView = std::make_shared<OrmView>();

  ormView->options->insert(
    ormView->options->end(),
    {
      {
        "Undo", 
        false, 
        [abstractMenu, ormView](){
          ormView->life = false;
          abstractMenu->lifecycle();
        }
      },
      { 
        "Prisma", 
        false, 
        [ormView](){
          setORM(ormView, true);
        }
      },
      { 
        "TypeORM (default)", 
        true, 
        [ormView](){
          setORM(ormView, false);
        }
      }
    }
  );
  
  struct OrmComponentReturn container {
    ormView
  };
  return container;
}
