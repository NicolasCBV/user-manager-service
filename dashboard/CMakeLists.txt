cmake_minimum_required(VERSION 3.5)
project(init CXX)

add_compile_options(-Wall -Werror -Wextra -Wpedantic -g)

add_definitions(-DPROJECT_DIR="${CMAKE_SOURCE_DIR}")

# SET VERSION
set(CMAKE_CXX_STANDARD 20)
message(STATUS "use c++20")

# SET LIBS
find_package(Curses REQUIRED)
include_directories(${CURSES_INCLUDE_DIR})

# INCLUDE EXECUTABLE
add_executable(${PROJECT_NAME} src/main.cc)

# DEFINE AUX DIRS AND INCLUDE THEM
aux_source_directory(src/checks CHECKS_SRC)

aux_source_directory(src/views/main.view MAIN_VIEW_SRC)
aux_source_directory(src/views/actions.view ACTIONS_VIEW_SRC)
aux_source_directory(src/views/orm.view ORM_VIEW_SRC)

aux_source_directory(src/initializers/components/orm.view ORM_COMPONENT_SRC)
aux_source_directory(src/initializers/menus/main.menu MAIN_MENU_SRC)
aux_source_directory(src/initializers/menus/actions.menu ACTIONS_MENU_SRC)

aux_source_directory(src/window WINDOW_SRC)

target_sources(
  ${PROJECT_NAME} 
  PRIVATE 
  
  ${CHECKS_SRC}

  ${MAIN_VIEW_SRC}
  ${ACTIONS_VIEW_SRC}
  ${ORM_VIEW_SRC}
  
  ${ORM_COMPONENT_SRC}
  ${MAIN_MENU_SRC}
  ${ACTIONS_MENU_SRC}

  ${WINDOW_SRC}
)

# INCLUDE LIBS ON LINK STAGE
target_link_libraries(${PROJECT_NAME} ${CURSES_LIBRARIES})

