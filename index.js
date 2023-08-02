const pikachu = {
    name: "Pikachu",
    type: "electric",
    ability: {
        "primary": "Static",
        "hidden": "Lightning rod"
    },
    stats: {
        hp: 35,
        attack: 55,
        defense: 40,
        speed: 90
    },
    moves: [
        "Quick Attack", "Volt Tackle", "Iron Tail", "Thunderbolt"
    ],
    modifiers: {
        "weakness": ["ground"],
        "resistances": ["electric", "flying", "water", "steel"]
    }
};

const squirtle = {
    name: "Squirtle",
    type: "water",
    ability: {
        "primary": "Torrent",
        "hidden": "Rain Dish"
    },
    stats: {
        hp: 44,
        attack: 48,
        defense: 50,
        speed: 43
    },
    moves: [
        "Tackle", "Tail Whip", "Water Gun", "Hydro Pump"
    ],
    modifiers: {
        "weakness": ["electric", "grass"],
        "resistances": ["water", "fire", "ice", "steel"]
    }
};

const getMoves = ({ moves }) => [...moves];
const getPrimaryAbility = ({ ability }) => ({ ...ability }.primary || "");
const getWeaknesses = ({ modifiers }) => [...modifiers.weakness] || [];
const getResistances = ({ modifiers }) => [...modifiers?.resistances] || [];
const resistsType = (pokemon, type) => {
    const weaknesses = getWeaknesses(pokemon);
    return weaknesses.includes(type);
};

const resistsMove = (pokemon, move) => {
    return pokemon?.modifiers.resistances.includes(move.type) || false;
};

const isWeakAgainst = ({ attacker, attacked }) => {
    return resistsType(attacked, attacker.type);
};

const isStrongAgainst = ({ attacker, attacked }) => {
    return resistsType(attacker, attacked.type);
};

const addAbility = (pokemon, abilityObj) => {
    return {
        ...pokemon,
        ability: {
            ...pokemon.ability,
            ...abilityObj
        }
    };
};

const addMove = (pokemon, move) => {
    return {
        ...pokemon,
        moves: [...pokemon.moves, move]
    };
};

const removeMove = (pokemon, move) => {
    const updatedMoves = pokemon.moves.filter((m) => m !== move);
    return {
        ...pokemon,
        moves: updatedMoves
    };
};

const getAttackModifier = ({ attacker, attacked }) => {
    if (isWeakAgainst({ attacker, attacked })) {
        return 2;
    } else if (isStrongAgainst({ attacker, attacked })) {
        return 0.5;
    } else {
        return 1;
    }
};

const getAttackLog = ({ attacker, attacked, move, damage, modifier }) => {
    let log = `${attacker} used ${move}! ${attacked} lost ${damage} HP!`;
    if (modifier === 2) {
        log += " It's super effective!";
    } else if (modifier === 0.5) {
        log += " It's not very effective!";
    }
    return log;
};

const calculateDamage = ({ attack, defense, modifier }) => {
    return 0.5 * attack * (attack / defense) * modifier;
};

const battle = (pokemon1, pokemon2) => {
    const battleHistory = [];
    let rounds = 0;

    while (pokemon1.stats.hp > 0 && pokemon2.stats.hp > 0) {
        rounds++;
        const attacker = pokemon1.stats.speed > pokemon2.stats.speed ? pokemon1 : pokemon2;
        const attacked = attacker === pokemon1 ? pokemon2 : pokemon1;
        const randomMoveIndex = Math.floor(Math.random() * attacker.moves.length);
        const move = attacker.moves[randomMoveIndex];
        const modifier = getAttackModifier({ attacker, attacked });
        const damage = calculateDamage({
            attack: attacker.stats.attack,
            defense: attacked.stats.defense,
            modifier
        });
        attacked.stats.hp -= damage;
        const log = getAttackLog({
            attacker: attacker.name,
            attacked: attacked.name,
            move,
            damage,
            modifier
        });
        battleHistory.push(log);
    }

    const winner = pokemon1.stats.hp > 0 ? pokemon1 : pokemon2;
    const loser = winner === pokemon1 ? pokemon2 : pokemon1;
    return {
        rounds,
        results: {
            winner: {
                name: winner.name,
                hp: winner.stats.hp
            },
            loser: {
                name: loser.name,
                hp: loser.stats.hp
            }
        },
        history: battleHistory
    };
};

// Test unitarios
const testGetMoves = getMoves(pikachu);
console.log("getMoves:", testGetMoves);

const testGetPrimaryAbility = getPrimaryAbility(squirtle);
console.log("getPrimaryAbility:", testGetPrimaryAbility);

const testGetWeaknesses = getWeaknesses(pikachu);
console.log("getWeaknesses:", testGetWeaknesses);

const testGetResistances = getResistances(squirtle);
console.log("getResistances:", testGetResistances);

const testResistsType = resistsType(squirtle, "water");
console.log("resistsType:", testResistsType);

const testResistsMove = resistsMove(squirtle, { name: "Water Gun", type: "water" });
console.log("resistsMove:", testResistsMove);

const testIsWeakAgainst = isWeakAgainst({ attacker: pikachu, attacked: squirtle });
console.log("isWeakAgainst:", testIsWeakAgainst);

const testIsStrongAgainst = isStrongAgainst({ attacker: squirtle, attacked: pikachu });
console.log("isStrongAgainst:", testIsStrongAgainst);

const testAddAbility = addAbility(pikachu, { secondary: "Discharge" });
console.log("addAbility:", testAddAbility);

const testAddMove = addMove(squirtle, "Surf");
console.log("addMove:", testAddMove);

const testRemoveMove = removeMove(pikachu, "Iron Tail");
console.log("removeMove:", testRemoveMove);

const testGetAttackModifier = getAttackModifier({ attacker: pikachu, attacked: squirtle });
console.log("getAttackModifier:", testGetAttackModifier);

const testGetAttackLog = getAttackLog({
    attacker: "Squirtle",
    attacked: "Pikachu",
    move: "Water Gun",
    damage: 12,
    modifier: 2
});
console.log("getAttackLog:", testGetAttackLog);
const testBattle = battle(pikachu, squirtle);
console.log("battle:", testBattle);
