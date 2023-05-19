#!/bin/sh

/usr/bin/clear

GREEN='\033[0;32m';
RED='\033[0;31m';
CYAN='\033[0;36m';
RESET='\033[0m';

ERRIV="${RED}Invalid response.${RESET}";

end() {
    /bin/echo -e -n "\n${CYAN}Type something:${RESET} ";
    read NEXT;
    menu;
}

# FUNCTION DEFINITIONS:
migrations() {
    /usr/bin/clear;
    /bin/echo -e -n "${CYAN}Chose what you wanna do:${RESET}
    ${CYAN}1.${RESET} Create migration
    ${CYAN}2.${RESET} Reset database and apply migrations
    ${CYAN}3.${RESET} Apply all pendent migrations
    ${CYAN}4.${RESET} Check the status of migrations
    ${CYAN}5.${RESET} Back to menu
    ${CYAN}6.${RESET} exit
    \nType your answer: ";
    read MIGRATION_OPT;

    "Running migration...";
    /usr/bin/clear;

    case $MIGRATION_OPT in
        1) 
            yarn prisma migrate dev;
            end;
        ;;
        2) 
            yarn prisma migrate reset;
            end;
        ;;
        3) 
            yarn prisma migrate deploy;
            end;
        ;;
        4) 
            yarn prisma migrate status;
            end;
        ;;
        5) menu;;
        6) exit 0;;
        *)
            /bin/echo -e $ERRIV;
            exit 1;
        ;;
    esac
}

main() {
    /usr/bin/clear;
    case $RESPONSE in
        1) 
            /bin/echo "HINT: if you doesn't runned 'yarn migrate:sql', please run after initialize the mysql db.";
            /bin/echo "Initializing app in bash.   :)";
            /bin/bash;
            menu;
        ;;

        2)  migrations;;

        3)  exit 0;;

        *)
            /bin/echo -e $ERRIV;
            exit 1;
        ;;
    esac
}

menu() {
    /usr/bin/clear;
    # EXECUTION:
    /bin/echo -e -n "${CYAN}######${RESET} ${GREEN}WELCOME TO USER SERVICE${RESET} ${CYAN}######${RESET} \nChose what you wanna do:
    ${CYAN}1.${RESET} Run bash
    ${CYAN}2.${RESET} Create migrations
    ${CYAN}3.${RESET} To exit
    \nType your answer: ";

    read RESPONSE;
    main $RESPONSE;
    if [ -z $RESPONSE ]; then
        /bin/echo -e "${RED}Expected an input.${RESET}";
        exit 1;
    fi
}

menu;
