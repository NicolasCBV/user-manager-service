#pragma once

#include "../../window/window-flow.h"
#include "../abstractView.h"
#include <chrono>
#include <cstdlib>
#include <initializer_list>
#include <ios>
#include <iostream>
#include <memory>
#include <string>
#include <thread>
#include <vector>
#include <fstream>
#include <ncurses.h>

using std::vector;
using std::shared_ptr;
using std::make_shared;
using std::initializer_list;
using std::system;

class OrmMenu : public AbstractView, public WindowFlow {
  public:
    shared_ptr<vector<Option>> options = make_shared<vector<Option>>(initializer_list<Option>{
      { 
        "Prisma", 
        false, 
        [this](){
          this->remove();
          system("clear && echo \"The system now uses Prisma\"");
          std::this_thread::sleep_for(std::chrono::milliseconds(2000));

          std::ifstream read("/menu/prismaORM.clone.txt");
          std::ofstream write("/usr/app/src/infra/storages/db/database.module.ts");

          if(!read.is_open() || !write.is_open()) {
            system("/bin/clear && echo \"Unable to open required files. Stopping operation.\"");
            std::this_thread::sleep_for(std::chrono::milliseconds(2000));

            this->spawn();
            this->lifeCycle();
            return;
          }

          std::string line;
          while(std::getline(read, line)) {
            write << line << std::endl;
          }
         
          read.close();
          write.close();

          write.open("/usr/app/tsconfig-excludes.json");

          if(!write.is_open()) {
            system("/bin/clear && echo \"Unable to open required files. Stopping operation.\"");
            std::this_thread::sleep_for(std::chrono::milliseconds(2000));

            this->spawn();
            this->lifeCycle();
            return;
          }

          write << "{\n";
          write << "  \"exclude\": [\n";
          write << "    \"**/*spec.ts\",\n";
          write << "    \"dashboard/**/*\",\n";
          write << "    \"**/*test*\",\n";
          write << "    \"**/*typeorm*\",\n";
          write << "    \"ormconfig.ts\",\n";
          write << "    \"node_modules\",\n";
          write << "    \"dist\"\n";
          write << "  ]\n";
          write << "}";

          write.close();

          this->spawn();
          this->lifeCycle();
        } 
      },
      { 
        "TypeORM (default)", 
        true, 
        [this](){
          this->remove();

          system("clear && echo \"The system now uses TypeORM\"");
          std::this_thread::sleep_for(std::chrono::milliseconds(2000));

          std::ifstream read;
          std::ofstream write;

          read.open("/menu/typeORM.clone.txt");
          write.open("/usr/app/src/infra/storages/db/database.module.ts");

          if(!read.is_open() || !write.is_open()) {
            system("/bin/clear && echo \"Unable to open required files. Stopping operation.\"");
            std::this_thread::sleep_for(std::chrono::milliseconds(2000));

            this->spawn();
            this->lifeCycle();
            return;
          }

          std::string line;
          while(std::getline(read, line)) {
            write << line << std::endl;
          }
         
          read.close();
          write.close();

          write.open("/usr/app/tsconfig-excludes.json");

          if(!write.is_open()) {
            system("/bin/clear && echo \"Unable to open required files. Stopping operation.\"");
            std::this_thread::sleep_for(std::chrono::milliseconds(2000));

            this->spawn();
            this->lifeCycle();
            return;
          }
 
          write << "{\n";
          write << "  \"exclude\": [\n";
          write << "    \"**/*spec.ts\",\n";
          write << "    \"dashboard/**/*\",\n";
          write << "    \"**/*test*\",\n";
          write << "    \"**/*prisma*\",\n";

          write << "    \"node_modules\",\n";
          write << "    \"dist\"\n";
          write << "  ]\n";
          write << "}";

          write.close();

          this->spawn();
          this->lifeCycle();
        } 
      }
    });
    bool life = false;
    void spawn() override;
    void lifeCycle() override;
    void remove() override; 
};
