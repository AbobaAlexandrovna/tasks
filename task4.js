'use strict';
const readlineSync = require('readline-sync');

function randomNum(min, max) {
    return Math.floor(min + Math.random() * (max + 1 - min));
}

function calculateDamage(health, damage, armor) {
    return health - (damage - ((damage / 100) * armor));
}

function printActionInfo(move) {
    if (move.physicalDmg != 0) {
        console.log(`Физический урон равен ${move.physicalDmg}`);
    }
    if (move.magicDmg != 0) {
        console.log(`Магический урон равен ${move.magicDmg}`);
    }
    if (move.physicArmorPercents != 0) {
        console.log(`Физическая броня равна ${move.physicArmorPercents}%`);
    }
    if (move.magicArmorPercents != 0) {
        console.log(`Магическая броня равна ${move.magicArmorPercents}%`);
    }
    if (move.cooldown != 0) {
        console.log(`Перезарядка ${move.cooldown} раундов`);
    }
}

const monster = {
    maxHealth: 10,
    name: "Лютый",
    moves: [
        {
            "id": 1,
            "name": "Удар когтистой лапой",
            "physicalDmg": 3, // физический урон
            "magicDmg": 0,    // магический урон
            "physicArmorPercents": 20, // физическая броня
            "magicArmorPercents": 20,  // магическая броня
            "cooldown": 0     // ходов на восстановление
        },
        {
            "id": 2,
            "name": "Огненное дыхание",
            "physicalDmg": 0,
            "magicDmg": 4,
            "physicArmorPercents": 0,
            "magicArmorPercents": 0,
            "cooldown": 3
        },
        {
            "id": 3,
            "name": "Удар хвостом",
            "physicalDmg": 2,
            "magicDmg": 0,
            "physicArmorPercents": 50,
            "magicArmorPercents": 0,
            "cooldown": 2
        },
    ]
};

const hero = {
    maxHealth: 20,
    name: "Евстафий",
    moves: [
        {
            "id": 4,
            "name": "Удар боевым кадилом",
            "physicalDmg": 2,
            "magicDmg": 0,
            "physicArmorPercents": 0,
            "magicArmorPercents": 50,
            "cooldown": 0
        },
        {
            "id": 5,
            "name": "Вертушка левой пяткой",
            "physicalDmg": 4,
            "magicDmg": 0,
            "physicArmorPercents": 0,
            "magicArmorPercents": 0,
            "cooldown": 4
        },
        {
            "id": 6,
            "name": "Каноничный фаербол",
            "physicalDmg": 0,
            "magicDmg": 5,
            "physicArmorPercents": 0,
            "magicArmorPercents": 0,
            "cooldown": 3
        },
        {
            "id": 7,
            "name": "Магический блок",
            "physicalDmg": 0,
            "magicDmg": 0,
            "physicArmorPercents": 100,
            "magicArmorPercents": 100,
            "cooldown": 4
        },
    ]
};

let difficulty = readlineSync.question(`Select difficulty (specify: 1, 2 or 3).\n`);

switch (+difficulty) {
    case 1:
        hero.maxHealth = 20;
        break;
    case 2:
        hero.maxHealth = 15;
        break;
    case 3:
        hero.maxHealth = 10;
        break;
    default:
        break;
}

console.log(hero.maxHealth);

let cooldowns = [];

do {

    // get moves without cooldown

    let monsterMovesWithoutCD = monster.moves.filter(move => cooldowns.findIndex(cd => cd.id == move.id) === -1);
    let heroMovesWithoutCD = hero.moves.filter(move => cooldowns.findIndex(cd => cd.id == move.id) === -1);
    
    // monsterMove

    console.log(`\nРаунд начался!`);
    
    let monsterMove = monsterMovesWithoutCD[randomNum(0, monsterMovesWithoutCD.length - 1)];
    console.log(`Монстр использует атаку ${monsterMove.name}.`);
    printActionInfo(monsterMove);
    
    if (monsterMove.cooldown > 0) {
        cooldowns.push({
            "id": monsterMove.id,
            "cooldown": monsterMove.cooldown,
        });
    }
    
    // heroMove

    let heroMove;

    console.log(`
    Ваши доступные действия:`)

    heroMovesWithoutCD.forEach((move, index) => {
        console.log(`
        ${index + 1}) Атака: ${move.name}`);
        printActionInfo(move)
    });
    
    do {

        let heroChoise = +readlineSync.question(`
        Enter a hero action number: \n`);

        if (Number.isNaN(heroChoise)) {
            console.log(`Введите номер атаки`);
            continue;
        }

        if (heroChoise && heroChoise > 0 && heroChoise <= heroMovesWithoutCD.length) {
            heroMove = heroMovesWithoutCD[heroChoise - 1];
            break;
        } else {
            console.log(`Выберите ответ из списка.`);
        }
    } while (true);

    if (heroMove.cooldown > 0) {
        cooldowns.push({
            "id": heroMove.id,
            "cooldown": heroMove.cooldown,
        });
    }

    // monster action

    if (monsterMove.physicalDmg != 0){
        hero.maxHealth = calculateDamage(
            hero.maxHealth, 
            monsterMove.physicalDmg, 
            heroMove.physicArmorPercents
        );
    }

    if (monsterMove.magicDmg != 0) {
        hero.maxHealth = calculateDamage(
            hero.maxHealth, 
            monsterMove.magicDmg,
            heroMove.magicArmorPercents
        );
    }

    // hero action

    if (heroMove.physicalDmg != 0) {
        monster.maxHealth = calculateDamage(
            monster.maxHealth,
            heroMove.physicalDmg,
            monsterMove.physicArmorPercents
        );
    }

    if (heroMove.magicDmg != 0) {
        monster.maxHealth = calculateDamage(
            monster.maxHealth,
            heroMove.magicDmg,
            monsterMove.magicArmorPercents
        );
    }

    // cooldowns check

    cooldowns.forEach(item => {
        item.cooldown = item.cooldown - 1;
    });

    cooldowns = cooldowns.filter(item => item.cooldown != 0);

    // death check

    if (hero.maxHealth <= 0 && monster.maxHealth <= 0){
        console.log(`Бой завершился смертью обоих противников.`);
        break;
    }
    else if (hero.maxHealth <= 0) {
        console.log(`Бой завершился смертью Евстафия.`);
        break;
    }
    else if (monster.maxHealth <= 0) {
        console.log(`Бой завершился смертью Лютого монстра.`);
        break;
    }
    else {
        console.log(`Раунд завершился.
    Здоровье монстра: ${monster.maxHealth.toFixed(2)}.
    Здоровье Естафия: ${hero.maxHealth.toFixed(1)}`);
    }
} while (true);
