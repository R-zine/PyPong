interface IUpgrade {
  main: string;
  flavor: string;
  price: number;
}

interface IUpgrades {
  [upgradeType: string]: IUpgrade[];
}

export const Upgrades: IUpgrades = {
  "Enemy Paddle": [
    {
      main: "Slightly reduce the size of the AI paddle",
      flavor: "It's cheating anyway, don't worry.",
      price: 10,
    },
    {
      main: "Further reduce the size of the AI paddle",
      flavor: "Honestly, this won't change much.",
      price: 100,
    },
    {
      main: "Make the AI paddle uncomfortably small",
      flavor: "10 inches, give or take.",
      price: 1000,
    },
  ],
  "Your Paddle": [
    {
      main: "Make your paddle slightly bigger",
      flavor: "Size matters.",
      price: 10,
    },
    {
      main: "Further increase the size of your paddle",
      flavor: "Size really matters.",
      price: 100,
    },
    {
      main: "Make your paddle so big, it feels like cheating",
      flavor: "Overcompensating?",
      price: 1000,
    },
  ],
  "Balls And Lives": [
    {
      main: "Gain one extra life per round and one extra ball",
      flavor: "This probably wouldn't matter.",
      price: 10,
    },
    {
      main: "Another life, another ball",
      flavor: "A different meaning to 'grow a pair'.",
      price: 100,
    },
    {
      main: "Another life... you know the drill",
      flavor: "A.K.A. The Chernobyl upgrade",
      price: 1000,
    },
  ],
  "Score Multiplier": [
    {
      main: "2x multiplier for your score",
      flavor: "Typical Wednesday at an AI start-up.",
      price: 10,
    },
    {
      main: "5x multiplier for your score",
      flavor: "This is like a crypto scheme, but actually not a scam.",
      price: 100,
    },
    {
      main: "10x multiplier for your score",
      flavor: "Ponzi would be proud.",
      price: 1000,
    },
  ],
  ballcalypse: [
    {
      main: "There's a 0.01% chance to launch 10 balls in random directions every 100 bounces.",
      flavor: "This game has to end somehow.",
      price: 10,
    },
    {
      main: "0.1% chance to trigger the Ballcalypse with 100 balls every 10 bounces",
      flavor: "50% chance your PC crashes.",
      price: 500,
    },
    {
      main: "Every bounce has a 1% chance to send a 1000 balls at the AI",
      flavor: "You win, but at the cost of of your browser crashing.",
      price: 10000,
    },
  ],
} as const;
