#pragma once

#include "../../window/window-flow.h"
#include "../abstractView.h"
#include <ncurses.h>
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

class ActionsMenu : public AbstractView, public WindowFlow {
  public:
    shared_ptr<vector<Option>> options = make_shared<vector<Option>>(initializer_list<Option>{
      {
        "Exit", 
        false,
        [this](){
          this->remove();
          this->life = false;
          system("clear && echo \"Exiting...\" && exit");
        },
      },
      {
        "Run bash",
        false,
        [this](){
          this->remove();
          this->life = false;

          system(R"(
            clear;
            echo "WARN: If you are running prisma, you must run some migration before start server";
            /bin/bash;
          )");

          this->spawn();
          this->lifeCycle();
        }
      },
      {
        "Run zsh",
        true,
        [this](){
          this->remove();
          this->life = false;

          system(R"(
            clear;
            echo "WARN: If you are running prisma, you must run some migration before start server";
            /bin/zsh;
          )");

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
