import { Character } from "../characters";

/**
 * Estrae un elemento casuale da un array (probabilità uniforme).
 */
export function spinEqual<T>(arr: T[]): T {
  if (!arr.length) throw new Error("Array vuoto in spinEqual");
  const idx = Math.floor(Math.random() * arr.length);
  return arr[idx];
}

/**
 * Restituisce un evento casuale di classe tra alcune opzioni predefinite.
 * Puoi personalizzare la logica secondo le tue esigenze.
 */
export function randomClassEvent(professor: Character<'Teacher'>, buddy: Character<'Student'>): string
{
  let events: string[] = [];
  if (professor.subject === 'Flying')
  {
    events.push(
      `Today is a sunny day, perfect for flying practice.`,
      `Today is a windy day, you don't feel very stable on your broom.`,
      `Today is a foggy day, making it hard to see while flying.`,
      `Today is a rainy day, you struggle to keep your grip on the broom.`,
      `A flock of owls flies alongside you for a moment.`,
      `You spot a Hippogriff in the distance, majestically soaring through the sky.`,
      `You perform a perfect landing, but no one sees it.`,
      `${buddy.longname} spots a centaur-looking cloud.`,
      `${buddy.longname} accidentally falls off their broom at takeoff.`,
    );
    return spinEqual(events);
  }

  let heshe = buddy.male ? "he" : "she", himher = buddy.male ? "him" : "her", hisher = buddy.male ? "his" : "her", HisHer = buddy.male ? "His" : "Her";
  let prof = professor.longname, bud = buddy.longname;

  events.push(
    `${bud}'s hair today are shocking green.`,
    `${bud}'s hair today are a vibrant shade of pink.`,
    `${bud}'s hair today are a deep shade of blue.`,
    `${bud}'s hair today are yellow and green.`,
    `From the corridor, Peeves can be heard humming a raunchy song.`,
    `You notice ${bud}'s quill is taking notes by itself.`,
    `One of the paintings in the back of the classroom bursts out laughing for no apparent reason.`,
    `Suddenly, a strange smell fills the classroom, distracting everyone.\nThe smell goes away as quickly as it came.`,
    `Halfway through the lesson, the classroom fills with a sudden chill.\n${prof} lights a magical fire to warm everyone up.`,
    `You notice a scarf creeping in from under the class's door.\nIt then curls up on a desk at the back of the room, and doesn't move for the rest of the lesson.`,
    `You hear distant thunder, even though the sky outside is clear.`,
    `Two feathers fall on ${bud}'s desk, but no one understands where they came from.`,
    `${bud}'s inkwell tips over, but the ink recomposes itself in the bottle.`,
    `${bud} asks you to borrow a quill.`,
    `${bud} sneezes loudly, causing a few heads to turn.`,
    `You notice that today ${bud}'s socks are randomly changing colors.`,
    `You hear ${bud} muttering something about the ghost of ${hisher} cat.`,
    `${bud} accidentally sets ${hisher} desk on fire, but ${heshe} manages to extinguish it before ${prof} notices.`,
    `An owl flies past the window, making a mess and distracting everyone.\n${prof} makes it go away.`,
    `You notice ${bud}'s parchment folding itself neatly in half.`,
    `${bud} drops ${hisher} quill, but it hovers midair before landing softly back on the desk.`,
    `A whisper echoes through the room, though no one seems to have spoken.`,
    `${bud}'s parchment suddenly rolls itself up and refuses to open again.`,
    `${bud} seems to be staring into space, blinking very slowly, as if under a spell.`,
    `A book falls off a shelf on its own, making ${bud} jump on ${hisher} seat.`,
    `The windows rattle briefly, though there's no wind outside.`,
    `A faint scent of pumpkin juice fills the classroom out of nowhere.`,
    `You catch a glimpse of something shimmering behind ${prof}, but it's gone before you can focus.`,
    `A parchment frog hops across ${bud}'s desk before flattening back into paper.`,    
  );

  if (professor.subject === 'Potions')  
    events.push(
      `${prof} scolds ${bud} for not following the potion recipe correctly, and takes 5 points from ${buddy.house}.`,
      `${bud} accidentally messes with ${hisher} cauldron, causing a small explosion.\n${HisHer} face is now orange.`,
      `${bud} talks back to ${prof}, resulting in 10 points taken from ${buddy.house}.`,
    );

  if (professor.subject === 'Defense Against the Dark Arts')
    events.push(
      `${bud} failed to casts a spell, targeting ${himher}self instead of ${hisher} target.`,
      `${bud} was briefly attacked by ${hisher} textbook.`,
    );

  if (professor.subject === 'Care of Magical Creatures')
    events.push(
      `${prof} asks ${bud} to demonstrate how to hold a creature.\nThe creature peed itself a lot in ${hisher} arms.`,
      `${bud} covers ${himher}self in mud to blend with the magical creatures.`,
      `${bud} tries to befriend a Niffler, but it steals ${hisher} wand instead.`,
      `${bud} was briefly attacked by ${hisher} textbook.`,
    );
  
  if (professor.subject === 'Herbology')
    events.push(
      `${bud} gets pricked by a venomous plant.`,
      `${bud} gets sprayed with pollen, causing ${himher} to sneeze uncontrollably for the rest of the day.`,
      `${bud} gets sprayed with a magic flower's pollen. ${HisHer} face is now purple.`,
      `${bud} gets ${hisher} hands cut by the plant ${heshe} was pruning.`,
    );

  if (professor.subject === 'Charms')
    events.push(
      `${bud} accidentally makes ${prof}'s desk float.`,
      `${bud} tries to enchant ${hisher} quill to take notes,\nbut it goes out of control and starts writing on ${hisher} face.`,
      `${bud} fails to cast a spell and causes a mirror to dance uncontrollably.`,
    );

  if (professor.subject === 'Transfiguration')
    events.push(
      `${bud} accidentally turns a frog into a hat.`,
    );

  if (professor.subject === 'History of Magic')
    events.push(
      `${bud} falls asleep during a lecture about the Goblin Rebellions.`,
      `${bud} falls asleep during a lecture about the History of the Ministry of Magic.`,
      `${bud} falls asleep during a lecture about the International Statute of Wizarding Secrecy.`,
      `${bud} falls asleep during a lecture about the establishment of the Wizengamot.`,
      `${bud} falls asleep during a lecture about the magical causes of the Great Fire of London.`,      
      `${bud} asks a question about a topic that was just covered,\ncausing ${prof} to dive into a lengthy explanation.`,
    );

  if (professor.subject === 'Divination')
    events.push(
      `${bud} misinterprets a tea leaf pattern, causing a minor panic.`,
      `${bud} predicts something embarrassing will happen to ${himher} later that day.\nYou haven't found out if it has come true.`,
      `${bud} predicts ${prof} Seamus predicts the teacher's imminent stumble at ${hisher} desk.`,
      `${bud} predicts that the weather will remain nice throughout the lesson.\nToward the end, the teacher gives ${buddy.house} 5 points, while you notice some clouds coming from the distance.`,
    );

  return spinEqual(events);
}


/**
 * Sorteggia un numero in base alle percentuali fornite.
 * @example spin(30, 70); // 30% di probabilità di ottenere 1, 70% di ottenere 2.
 * @param percentages Array di numeri che rappresentano le probabilità relative di ciascun risultato.
 * @returns Il numero sorteggiato (si parte da 1).
 */
export function spin(...percentages: number[]): number
{
  console.log(`Percentuali: [${percentages.join(", ")}]. Spin...`);

  const total = percentages.reduce((a, b) => a + b, 0);
  if (percentages.length < 2) return 0;

  const val = Math.random() * total;
  let cumulative = 0;
  for (let i = 0; i < percentages.length; i++)
  {
    cumulative += percentages[i];
    if (val < cumulative) return i + 1;
  }
  return 0;
}

/**
 * Restituisce true con probabilità proporzionale al primo parametro, false al secondo.
 * @example spinbool(30, 70); // 30% di probabilità true, 70% di false.
 * @param a Probabilità (relativa) di ottenere true
 * @param b Probabilità (relativa) di ottenere false
 */
export function spinbool(a: number, b: number): boolean { return spin(a, b) === 1; }
