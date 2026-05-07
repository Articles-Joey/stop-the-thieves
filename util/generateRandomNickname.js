
const adjectives = [
    'Funny', 'Wacky', 'Silly', 'Goofy', 'Zany', 'Clumsy', 'Bouncy', 'Wobbly',
    'Grumpy', 'Sneaky', 'Dizzy', 'Fluffy', 'Chunky', 'Speedy', 'Squishy', 'Grouchy',
    'Bumbling', 'Wiggly', 'Dopey', 'Cranky', 'Loony', 'Bonkers', 'Nutty', 'Jolly',
    'Pudgy', 'Rowdy', 'Feisty', 'Reckless', 'Dozy', 'Woozy', 'Ornery'
];

const mazeNouns = [
    'Stomper', 'Fighter', 'Gladiator', 'Attacker', 'Basher', 'Bonker', 'Brawler', 'Charger',
    'Thumper', 'Clobberer', 'Walloper', 'Puncher', 'Bopper', 'Smasher', 'Crasher', 'Slapper',
    'Tackler', 'Rusher', 'Lunger', 'Bouncer', 'Trampler', 'Bumper', 'Rambler', 'Tumbler',
    'Grappler', 'Wrangler', 'Scuffler', 'Scrapper', 'Rumbler', 'Jostler', 'Pouncer'
];


/**
 * Generates a random maze-themed nickname.
 * @returns {string} A random nickname like "LostRunner42" or "TwistedPathfinder7".
 */
const generateRandomNickname = () => {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = mazeNouns[Math.floor(Math.random() * mazeNouns.length)];
    const num = Math.floor(Math.random() * 100);
    return `${adj}${noun}${num}`;
};

export default generateRandomNickname;