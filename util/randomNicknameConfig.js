
import generateRandomNickname from '@articles-media/articles-dev-box/generateRandomNickname';

const randomNicknameConfig = {
  type: 'Basic',
  parts: [
    [
      'Funny', 'Wacky', 'Silly', 'Goofy', 'Zany', 'Clumsy', 'Bouncy', 'Wobbly',
      'Grumpy', 'Sneaky', 'Dizzy', 'Fluffy', 'Chunky', 'Speedy', 'Squishy', 'Grouchy',
      'Bumbling', 'Wiggly', 'Dopey', 'Cranky', 'Loony', 'Bonkers', 'Nutty', 'Jolly',
      'Pudgy', 'Rowdy', 'Feisty', 'Reckless', 'Dozy', 'Woozy', 'Ornery'
    ],
    [
      'Stomper', 'Fighter', 'Gladiator', 'Attacker', 'Basher', 'Bonker', 'Brawler', 'Charger',
      'Thumper', 'Clobberer', 'Walloper', 'Puncher', 'Bopper', 'Smasher', 'Crasher', 'Slapper',
      'Tackler', 'Rusher', 'Lunger', 'Bouncer', 'Trampler', 'Bumper', 'Rambler', 'Tumbler',
      'Grappler', 'Wrangler', 'Scuffler', 'Scrapper', 'Rumbler', 'Jostler', 'Pouncer'
    ]
  ]
};

export default () => generateRandomNickname(randomNicknameConfig);