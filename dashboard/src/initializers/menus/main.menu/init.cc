#include "init.hpp"
#include "../../components/orm.view/view.hpp"
#include <chrono>
#include <stdexcept>
#include <thread>

MainMenuReturn MainMenu::init() {
  std::shared_ptr<MainView> mainView = std::make_shared<MainView>();
  OrmComponentReturn ormContainer = OrmComponent::init(mainView);

  mainView->options->insert(
    mainView->options->end(),
    {
      {
        "Exit", 
        false,
        [mainView](){
          Window::finish();
          mainView->life = false;
          system("exit");
        },
      },
      {
        "Select ORM", 
        false, 
        [ormContainer, mainView](){ 
          mainView->life = false;
          ormContainer.instance->lifecycle();
        }
      },
      {
        "Build containers",
        false,
        [mainView](){
          Window::finish();
          mainView->life = false;

          std::cout << "Building containers...\n";
          system("cd ../../ && docker compose build");
          std::this_thread::sleep_for(std::chrono::milliseconds(1500));

          Window::init();
          mainView->lifecycle();
        }
      },
      {
        "Start services",
        true,
        [mainView](){
          Window::finish();
          mainView->life = false;

          std::cout << "Starting services...\n";
          system(R"(
            cd ../../;
            docker compose run \
              --rm -p 3030:3030 \
              app /menu/init -actions /usr/app/user-service/
          )");
          std::this_thread::sleep_for(std::chrono::milliseconds(1500));

          Window::init();
          mainView->lifecycle();
        }
      }
    }
  );

  struct MainMenuReturn container = {
    mainView
  };

  return container;
}
