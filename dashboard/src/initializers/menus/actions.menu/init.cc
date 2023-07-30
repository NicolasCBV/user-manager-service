#include "init.hpp"
#include "../../components/orm.view/view.hpp"

ActionsMenuReturn ActionsMenu::init() {
  std::shared_ptr<ActionsView> actionsView = std::make_shared<ActionsView>();
  OrmComponentReturn ormContainer = OrmComponent::init(actionsView);

  actionsView->options->insert(
    actionsView->options->end(),
    {
      {
        "Exit", 
        false,
        [actionsView](){
          Window::finish();
          actionsView->life = false;
          system("clear && echo \"Exiting...\" && exit");
        },
      },
      {
        "Select ORM", 
        false, 
        [ormContainer, actionsView](){ 
          actionsView->life = false;
          ormContainer.instance->lifecycle();
        }
      },
      {
        "Run bash",
        false,
        [actionsView](){
          Window::finish();

          system(R"(
            clear;
            echo "If necessary, don't forget to run migrations.";
            /bin/bash;
          )");

          Window::init();
          actionsView->lifecycle();
        }
      },
      {
        "Run zsh",
        true,
        [actionsView](){
          Window::finish();

          system(R"(
            clear;
            echo "If necessary, don't forget to run migrations.";
            /bin/zsh;
          )");

          Window::init();
          actionsView->lifecycle();
        }
      }
    }
  );

  struct ActionsMenuReturn container = {
    actionsView,
    ormContainer.instance 
  };

  return container;
}
