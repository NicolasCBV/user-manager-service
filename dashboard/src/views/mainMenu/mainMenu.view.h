#pragma once

#include "../../window/window-flow.h"
#include "../abstractView.h"
#include <cstdlib>
#include <initializer_list>
#include <iostream>
#include <memory>
#include <thread>
#include <vector>

using std::vector;
using std::shared_ptr;
using std::make_shared;
using std::initializer_list;
using std::system;

class MainMenu : public AbstractView, public WindowFlow {
  public:
    shared_ptr<vector<Option>> options = make_shared<vector<Option>>(initializer_list<Option>{
      {
        "Exit", 
        false,
        [this](){
          this->remove();
          this->life = false;
          system("exit");
        },
      },
      {
        "Build containers",
        false,
        [this](){
          this->remove();
          this->life = false;

          system("clear");
          std::cout << "Building containers...\n";
          system("cd ../../ && docker compose build");

          this->spawn();
          this->lifeCycle();
        }
      },
      {
        "Start services",
        true,
        [this](){
          this->remove();
          this->life = false;

          system("clear");
          std::cout << "Starting services...\n";
          system("cd ../../ && docker compose run --rm -p 3030:3030 app /menu/init actions");

          this->spawn();
          this->lifeCycle();
        }
      }
    });

    bool life = false;
    void spawn() override;
    void lifeCycle() override;
    void remove() override; 
    void jumpToORMMenu();
};
