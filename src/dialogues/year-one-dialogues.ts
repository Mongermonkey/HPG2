
import { write } from "./dialogue-helpers";
import * as random from "../utilities/random";
import { Clue } from "../utilities/compositetypes";
import { Character } from "../characters/characters";
import { hogwartsHouse, subject } from "../utilities/basetypes";

/**
 * Handles the arrival at Hogwarts.
 */
export async function arrivalAtHogwarts(): Promise<void>
{
    await write("On the first of September, you board the Hogwarts Express from platform nine and three-quarters at King's Cross Station.");
    await write("By the same evening, you arrive at the magnificent and mysterious Hogwarts Castle.");
}

/**
 * Handles the sorting ceremony dialogues.
 */
export async function sort(): Promise<void>
{
    await write("In the Great Hall, under a velvety black ceiling dotted with stars, the Sorting Ceremony is about to begin...");
    await write("Everyone seems very excited about it.");
    await write("The Sorting Hat is brought in, looking old and worn.");
    await write("He presents the four houses: Gryffindor, Hufflepuff, Ravenclaw and Slytherin.");
    await write("After a while, the Sorting Hat is placed on your head. It feels a bit heavy and itchy.");
    await write("\"...Hmmmm... Interesting... Very interesting...\", the hat recites.");
}

/**
 * Handles Dumbledore's speech after the sorting ceremony.
 * @param clue Whether the player has the clue about the third-floor corridor.
 */
export async function dumbledoresSpeech(clue: boolean): Promise<void>
{
    await write("After the sorting ceremony, a silver-haired man stands up from his golden chair.");
    await write("It's Albus Dumbledore, Hogwarts' headmaster.");
    await write("He says few words about the new year and the school.");
    await write("\"...And finally, I must tell you that this year, the third-floor corridor\non the right-hand side is "
        + (clue ? "OUT OF BOUNDS" : "out of bounds") + " to everyone who does not wish to die a very painful " + (clue ? "DEATH.\"" : "death.\""));
    await write("You start to laugh... But everyone else seems to take these words seriously.");
    if(clue) await write("You wonder what could be in that corridor to deserve such a warning...");
}

export async function flyingLesson(): Promise<void>
{
    await write("Madame Hooch makes seven circles of light appear in the air, all at different heights and distances from each other.");
    await write("She explains that you'll take turns trying to get through as many hoops as possible.");
    await write("Each one will have two attempts, and you can practice on the broom while the others are trying.");   
}

/**
 * Handles the Quidditch selection event.
 * @param captain The name of the Quidditch captain.
 * @param house The house of the mc.
 */
export async function QuidditchSelection(captain: string, house: string): Promise<void>
{
    await write(`The Quidditch tryouts are held by ${captain}, the ${house} captain.`);
    await write("After a brief explanation of the game, you are asked to demonstrate your flying skills.");
    await write("Do you pass the Quidditch selection?");
}

/**
 * Simulates a Quidditch game between two houses.
 * @param houseA The winner house.
 * @param houseB The loser house.
 */
export async function quidditchMatch(houseA: hogwartsHouse, houseB: hogwartsHouse): Promise<void>
{
    await write(random.spinEqual([
        `${houseA} wins after a fierce and rainy match against ${houseB}.`,
        `${houseA} dominates the field while ${houseB} struggles to keep up.`,
        `It’s a close game, but ${houseA} snatches victory by catching the Snitch first.`,
        `${houseA} takes an early lead, and ${houseB} never recovers.`,
        `A chaotic match — ${houseB}’s Beaters cause mayhem, but ${houseA} still wins.`,
        `The game is intense and fast-paced, with ${houseA} winning by a narrow margin.`,
        `${houseA}’s Seeker spots the Snitch early and ends the match in record time.`,
        `The crowd goes wild as ${houseA} pulls off a stunning last-minute win.`,
        `A rough match — several fouls, one broken broom, and ${houseA} victorious.`,
        `Heavy wind makes the game unpredictable, but ${houseA} adapts better and wins.`,
        `${houseA} dominates the match from start to finish.`,
        `${houseA}’s Keeper performs incredibly, blocking nearly every goal and assuring victory.`,
        `The Snitch is elusive — the match drags on for hours before ${houseA} finally wins.`,
        `${houseB} scores quickly, but ${houseA} turns the tide with brilliant teamwork.`,
        `A balanced game until ${houseA}’s Seeker dives and ends it with a clean catch.`,
        `Both teams play hard, but ${houseA}’s Chasers are unstoppable today. ${houseA} wins.`,
        `It’s a brutal game, full of bludgers and near collisions — ${houseA} still triumphs.`,
        `Rain and fog make visibility awful; ${houseA} takes advantage and wins.`,
        `A spectacular dive from ${houseA}’s Seeker seals the victory.`,
        `A slow, tactical match that ends with ${houseA} barely ahead.`,
        `${houseA} wins after ${houseB}’s Seeker misses the Snitch by inches.`,
        `${houseA} pulls a shocking upset over ${houseB}.`,
        `The stands erupt as ${houseA} defeats ${houseB} in one of the season’s best matches.`,
        `${houseA}’s Beaters keep ${houseB}’s Chasers constantly off balance.`,
        `${houseA} takes revenge for last year’s loss, crushing ${houseB}.`,
        `A messy game full of penalties, but ${houseA} keeps their composure and wins.`,
        `After hours of play, the Snitch finally ends up in ${houseA}’s hand.`,
        `After both Seekers crash mid-air, ${houseA} manages to claim the Snitch first.`,
        `${houseA} wins after ${houseB}’s Seeker is distracted by a rogue Bludger.`,
        `${houseA} celebrates wildly as their Seeker catches the Snitch inches before ${houseB}’s.`,
        `${houseA}’s Chasers outclass ${houseB}, scoring again and again.`,
        `${houseB} holds the lead for most of the match, but ${houseA} turns it around in the final minutes.`,
        `The Snitch appears only once — ${houseA} spots it first and ends the game instantly.`,
        `${houseA}’s Keeper saves the day with impossible reflexes.`,
        `After multiple weather delays, ${houseA} finally secures victory under the stars.`
    ]));

}

/**
 * Handles the library study event.
 * @param subject The subject being studied.
 * @param serious Whether the study session is serious or not.
 */
export async function subjectStudy(subject: subject, serious: boolean): Promise<void>
{
    await write('Since you are struggling with ' + subject + ', you decide to spend some time studying it in the library.');
    await write('You find a quiet corner and immerse yourself in the books.');
    if (serious) await write('After hours of intense study, you feel like you have a much better grasp of the subject now.');
    else await write ('Your knowledge of ' + subject + ' has improved.');
}

/**
 * Handles the conversation with a ghost.
 * @param ghost The ghost character.
 */
export async function ghostTalk(ghost: Character<'Creature'>): Promise<void>
{
    await write('While you were minding your business in the common room, you suddenly see a ghostly figure floating in the air.');
    await write('It\'s ' + ghost.longname + ', the ghost of ' + ghost.house + '.');
    await write('You start talking with ' + ghost.name + ', and you find out that ' + (ghost.male ? 'he' : 'she') + ' has a lot of interesting stories to tell about the history of Hogwarts.');
}

export async function stairsChange(): Promise<void>
{
    await write('You were warned that the Hogwarts stairs like to change, but you find yourself in the middle of it nonetheless.');
    await write('You try to find your way back, but the stairs keep changing and you end up completely lost in the castle.');
}

export async function HagridsHelp(): Promise<void>
{
    await write('Luckily you bump into Hagrid, who offers to help you find your way back.');
    await write('Hagrid is very friendly and kind, and you have a nice conversation with him while he guides you back to your dormitory.');
    await write('You feel grateful for Hagrid\'s help and kindness.');
}

export async function quidditchPractice(): Promise<void>
{
    await write("You attend a Quidditch practice session, where you practice your flying skills and bond with your teammates.");    
}

/**
 * Handles the encounter with Moaning Myrtle.
 * @param known Whether the player already knows Myrtle or not.
 * @param male The player's gender.
 */
export async function myrtleEncounter(known: boolean, male: boolean): Promise<void>
{
    if(known)
    {
        await write('You decide to pay a visit to Moaning Myrtle.');
        await write('She is very happy to see you, and she tells you all about her life as a ghost and her experiences in Hogwarts.');
        await write('You have a nice conversation with her.');
        await write('A very long conversation with her.');
        await write('After what feels like hours, you decide to take your leave.');
    }
    else
    {
        if (male) await write("Without really knowing how, you find yourself in the girl's bathroom on the second floor.\nYou're not supposed to be here...");
        else await write("You go to the girls' bathroom, but you find yourself in a very eerie and unsettling place.");

        await write("Suddenly, you hear someone softly crying. Just a moment ago you could have sworn you were completely alone...");
        await write("You come close to the cubicle where the crying comes.");
        await write("Suddenly, from the closed door emerges the glum face of a squat girl, hidden behind lank hair and thick glasses.");
        await write("For the next 45 minutes at least, you get stuck talking with Moaning Myrtle.");
        
        if (male) await write("You would never guessed how many small tragedies could unite a surprising number of girls.");
        else await write("You would never have imagined how perverted some students could be.");
    
        await write("As you ponder how many different lives have intertwined in front of those toilets, you notice Mirtilla smiling at you.");
        await write("She seems very happy to have someone to talk with again, after almost a year.");
        await write("You promise to come visit her again sometime.");
    }
}

/**
 * Handles the discovery of the Mirror of Erised.
 */
export async function mirrorOfErised(): Promise<void>
{
    await write("Wandering in the Castle, you discover an unused classroom.");
    await write("Propped against the wall, there is something that does not look as if it belong there...");
    await write("...something that look as if someone just put it there, to keep it out of the way.");
    await write("It is a magnificent mirror, as high as the ceiling, with an ornate gold frame, standing on two clawed feet.");
    await write("There is an inscription carved around the top: 'Erised stra ehru oyt ube cafru oyt on wohsi'.");
    await write("You stare into the Mirror of Erised.");

    // add random vision (?)
    
    await write("After a quite long time, you hear a voice from behind you.");
    await write("\"I see that you, like many before you, have discovered the delights of the Mirror of Erised.\"");
    await write("You turn around and see that it is Professor Dumbledore, the headmaster, who has spoken.");
    await write("The Professor starts talking about the mirror and what you see in it.");
    await write("The two of you have a long and very interesting conversation, about desires and choices.");
    await write("Professor Dumbledore finally states that the mirror will soon be moved and will have another purpose.");
    await write("He also emphasizes his desire that you not try to search for it again, for your own good.");
}

// #region REMEMBRALL SIDEQUEST

/**
 * Handles the introduction to the Remembrall sidequest.
 */
export async function remembrallIntro(): Promise<void>
{
    await write("During the first exercise, you notice a boy struggling with his broom.");
    await write("It's Neville Longbottom, a clumsy-looking Gryffindor student.");
    await write("Suddenly he takes flight, and starts speeding around dangerously!");
    await write("Madam Hooch, the flying instructor, blows her whistle and tries to stop him, without success.");
    await write("As everyone begins to panic, Neville falls from the broom and crashes to the ground!");
    await write("Madam Hooch rushes to his side and helps him up, taking him to the infirmary.");
    await write("While leaving, she makes VERY CLEAR that no one is to fly until she comes back.");
    await write("As Neville is taken away, you notice Draco Malfoy smirking and holding a small, round object.");
    await write("It's Neville's Remembrall! He must have lost it during the fall.\nDraco is making fun of Neville with his friends.");
    await write("What do you do?");
}

/**
 * Bad ending.
 */
export async function remembrallNinja(): Promise<void>
{    
    await write("Alas, as you try to snatch the Remembrall, Draco quickly pulls it away.");
    await write("You fall to the ground, and Draco laughs at you.");
    await write("Draco now despises you. He squeaks something about his father.");
}

export async function remembrallTrial(): Promise<void>
{
    await write("Draco taunts you, flying quickly up and daring you to catch the remembrall.");
    await write("You realize that you need to act fast to get it back.");
    await write("As you reach for it, Draco throws the Remembrall high into the air, very far away. Do you catch it?");
}

// #endregion REMEMBRALL SIDEQUEST

// #region TROLL SIDEQUEST

export async function trollIntro(): Promise<void>
{
    await write("On Halloween night, something bizarre happens.");
    await write("Professor Quirrell rushes into the Great Hall, his turban askew and terror on his face.");
    await write("Everyone stared as he reached Professor Dumbledore's chair, slumped against the table, and gasped," +
        "\n\"Troll -- in the dungeons -- thought you ought to know.\"");
    await write("He then sink to the floor in a dead faint.\nThere is an uproar.");
    await write("Professor Dumbledore quickly orders everyone to stay calm,\nand soon the heads of houses and the prefects start bringing everyone to their dormitories.");
}

export async function trollBadLuck(): Promise<void>
{
    await write("Unfortunately, you were at the bathroom until a few moments before that happened.");
    await write("You suddenly hear a loud roar echoing through the corridors.");
    await write("You reach the corner, and see a huge troll rampaging through the hallways!");
    await write("It seems very angry and dangerous, and it's coming directly at you.");
    await write("What do you do?");
}

export async function trollRescue(): Promise<void>
{
    await write("You noticed that you haven't seen Hermione around since before the chaos started.");
    await write("You know that she wasn't feeling right, and that she always goes to the bathroom when she's upset.");
    await write("The girls' bathroom is just ahead, but it is near the dungeon, so you rush there to check on her.");
    await write("As you enter, you see the monstrous tall figure of the troll! He's looming over Hermione, who is frozen in fear.");
    await write("What do you do?");
}

/**
 * Coward ending.
 */
export async function trollCoward(): Promise<void>
{
    await write("At the decisive moment, you find yourself a coward. You run away.");
    await write("You hear Hermione's terrified scream behind you as the troll grabs her.");
    await write("You manage to reach the dormitories safely, but you feel terrible for abandoning Hermione.");
    await write("Later, you find out that Hermione was rescued by Harry Potter and Ron Weasley.");
}

/**
 * Escape ending.
 */
export async function trollEscape(): Promise<void>
{
    await write("You manage to escape the troll's grasp and run back to the safety of the dormitories.");
    await write("Once inside, you talk about what just happened with the other students.");
    await write("After a while, all gather around you to hear your story.\nThey are all very interested in knowing all the details of the troll.");
    await write("You strengthen your bonds with your housemates!");
}

/**
 * Bad ending - freezing.
 */
export async function troll_freeze(): Promise<void>
{
    await write ("You freeze in terror and, before you can try anything, the troll hits you pretty hard.");
    await write ("You wake up the day after, in the Hospital Wing.");
    await write ("You try to explain, but you don't remember much.\nYou also can't remember well the last two weeks.");
    await write ("As Madam Pomfrey says, it may take some time to recover all the memories.");
    await write("This accident made you fall behind in your studies.");
}

/**
 * Good ending - Hermione saves the mc.
 * @param friends True if the mc already knows Hermione.
 * @param house The mc house.
 */
export async function troll_broom(friends: boolean, house: hogwartsHouse): Promise<void>
{
    await write ("You grab an old broom from nearby and use it to attack the troll.");
    await write ("You hit the troll on the knees. It's not very effective.");
    await write ("As the monster is about to strike you, something hits it from behind.");
    await write ("The monster turns around. It's Hermione Granger!");

    if (!friends) await write("Everybody knows her as the best student in your year already.");

    await write ("She quickly uses another spell to make the troll hit itself.");
    await write ("The troll falls to the ground, unconscious.");
    await write ("Professor McGonagall comes bursting into the room, closely followed by Snape, with Quirrell bringing up the rear.");
    await write ("You notice that Snape has a still bleeding wound on his leg. He immediately covers it.");

    await write(`As they find out what you two did, they take 5 points from ${house}, for the danger you put yourself in.`);
    await write("They also award 10 points from Gryffindor, for the courage and the skills Hermione showed.");

    await write("Tonight's events will make you more popular.");
}

/**
 * Good ending - defeating the troll (and rescuing Hermione).
 * @param rescue True if the mc is rescuing Hermione.
 * @param house The mc house.
 */
export async function troll_spell(rescue: boolean, house: hogwartsHouse): Promise<void>
{
    await write("You cast the first spell that comes to your mind.");
    await write("The troll's club flies suddenly out of the troll's hand, rises high, high up into the air," +
				"\nturns slowly over and drops, with a sickening crack, onto its owner's head.");
    await write("The troll sways on the spot and then falls flat on its face, with a thud that made the whole room tremble.");
    await write("A moment later, Professor McGonagall comes bursting into the room, closely followed by Snape, with Quirrell bringing up the rear.");
    await write("You notice that Snape has a still bleeding wound on his leg. He immediately covers it.");
    if (rescue)
    {
        await write("Hermione explains them that it was all her fault, and that you are her savior.");
        await write(`As they find out what you did, they award ${house} 10 points for your feat.`);
        await write("They also take 5 points from Gryffindor, for the danger Hermione put herself in.");
    }
    else
    {
        await write(`As they find out what you did, they take 5 points from ${house}, for your recklessness.`);
        await write('Apparently, another student tried to fight the troll, but was unsuccessful: Hermione Granger (Gryffindor).');
        await write('The professors take 5 points from Gryffindor, for the danger Hermione put herself in.');
        await write(`They also award 15 points to ${house}, for the impressive feat you accomplished.`);
    }
    await write("After tonight, you become quite popular among your peers.");
}

// #endregion TROLL SIDEQUEST

// #region DARK FOREST SIDEQUEST

/**
 * Handles the introduction to the Dark Forest sidequest with Hagrid.
 */
export async function DarkForestIntro(draco: boolean): Promise<void>
{
    await write('Hagrid shows up and explains the punishment: the two of you will help collecting some unicorn hair in the Dark Forest.');
    if (draco) await write('Draco seems terrified, and tries to object by threatening his father\'s intervention, but Hagrid ignores him.');
    await write('As you wander through the woods, the gatekeeper tells you how he recently found some dead specimens.');
    await write('He also shows you some unicorn\'s blood.');
    await write('Suddenly, Hagrid\'s dog Fang breaks free, and runs into the woods. Hagrid hurries after him, telling you to go back to the hut.');
}

/**
 * Handles the good ending of the Dark Forest sidequest.
 * @param buddy The name of the student that accompanies the mc in the forest.
 */
export async function DarkForest_GoodEnding(buddy: string): Promise<void>
{
    await write('For nearly half an hour, you walk through the woods. Both you and ' + buddy + ' collect some unicorn hair.');
    await write('As you walk back to the hut, you take the opportunity to talk with ' + buddy + ' and you get to know each other better.');
    await write('After a while, the two of you are back to Hagrid\'s hut.');
    await write('He seems very happy to see you back, and after thanking you for the unicorn hair let you go without a word.');
}

/**
 * Handles the bad ending of the Dark Forest sidequest.
 * @param buddy The name of the student that accompanies the mc in the forest.
 */
export async function DarkForest_BadEnding(buddy: string): Promise<void>
{
    await write('For nearly half an hour, you walk through the woods. Both you and ' + buddy + ' collect some unicorn hair.');
    await write('As you walk deeper and deeper into the forest, the path becomes harder to follow, until you realize you are completely lost.');
    await write('At some point, ' + buddy + ' notice something strange ahead. You both decide to check it out, and you find yourselves in front of a clearing.');
    await write('You cannot clearly distinguish what is in the middle of the clearing, but you can hear some strange noises coming from there.');
    await write('Suddenly, a group of centaurs emerge from the shadows and surround you. They look very angry.');
    await write('The centaurs are not angry at you however: they seems to be mad at a figure in the middle of the clearing, who just got up from...\na unicorn\s dead body.');
    await write('You can see the unicorn\'s blood dripping from the figure\'s hands... and mouth.\nThe centaurs chase it away.');
    await write('The centaurs then escort you, still trembling from what you witness, back to Hagrid\'s hut.');
    await write('One of the centaurs tells Hagrid what happened, and adds something about being lucky because centaurs "don\'t harm children".');
    await write('Neither you nor ' + buddy + ' can ever forget this night.');
}

// #endregion DARK FOREST SIDEQUEST

// #region NORBERT SIDEQUEST

/**
 * Norbert is born and Hagrid asks to keep it a secret.
 */
export async function meetingNorbert(lost: boolean): Promise<void>
{
    if (lost) await write('You randomly bump into a worried Hagrid, so you decide to follow him to his hut, where he offers you a tea.');
    else await write('You decide to pay a visit to Hagrid, and find him in his hut, looking a bit worried.');

    await write('After a while, he breaks the silence and tells you what is bothering him.');
    await write('Hagrid has a problem: he has won a dragon egg in a card game, and now it\'s about to hatch!');
    await write('He is very excited about it, but also very scared, because it\'ll be the first time for him taking care of a dragon.');
    await write('Just when he is about to ask you for help, the egg starts shaking and cracking, and a baby dragon emerges from it!');
    await write('Hagrid is overjoyed, and decides to name the dragon "Norbert".');
    await write('He asks you to keep the dragon thing a secret, at least for now.');
}

/**
 * Norbert needs to be safely and secretly taken away.
 */
export async function savingNorbert(): Promise<void>
{
    await write('In the last weeks, Norbert has doubled in size.');
    await write('Hagrid grows more and more worried about anyone to find out the illegal dragon.');
    await write('You decide to confront him on the dragon in the room.');
    await write('After a long discussion, Hagrid decides to entrust Norbert to Charlie Weasley, who studies dragons in Romania.');
    await write('Charlie and his friends can pick up Norbert the next weekend, but they have to do it in secrecy.');
    await write('On that night, Hagrid leaves Norbert to your cares: you have to bring him to the tallest tower.');
}

/**
 * Handles Norbert sidequest's bad ending.
 * @param HarryHelp Wheter Harry helped the mc or not.
 */
export async function NorbertFailure(HarryHelp: boolean): Promise<void>
{
    if (HarryHelp) await write('Despite Harry\'s invisibility cloak, you stumbled and are caught by Filch.');
    else await write('Unfortunately, you stumble and are caught by Filch.');

    await write('Norbert\'s cage opens and the little dragon flies away: luckily, he quickly reaches the sky.');
    await write('You see Norbert fly away, followed by some broomstick in the distance.');
}

/**
 * Handles Norbert sidequest's good ending.
 * @param HarryHelp Wheter Harry helped the mc or not.
 */
export async function NorbertSuccess(HarryHelp: boolean): Promise<void>
{
    await write('Thanks to your skills' + (HarryHelp ? ' and Harry\'s help' : '') + ', you managed to reach the roof of the tallest tower of Hogwarts\' Castle.');
    await write('After a while, Charlie Weasley and his friends come flying on their broomsticks.');
    await write('You saved Norbert!');
}

// #endregion NORBERT SIDEQUEST

// #region MAIN QUEST CLUES

/**
 * Handles the dialogue about the Gringotts robbery.
 */
export async function GringottsTheft(): Promise<void>
{
    await write('Apparently Gringott\'s, the oldest magical bank of England, has suffered a robbery.');
    await write('The thieves were able to bypass the bank\'s security measures and enter one of the deepest vaults.');
    await write('However, it seems that nothing was stolen, as the broken-in vault had been accidentally emptied the day before...');
}

/**
 * Handles the dialogue about Dumbledore's chocolate frog.
 * @param friendName The name of the friend giving the chocolate frog.
 */
export async function chocolateFrog(friendName: string): Promise<void>
{
    await write(`${friendName} gifts a chocolate frog to you.`);
    await write('The card reads as follows.');
    await write('\"Albus Dumbledore, currently Headmaster of Hogwarts.\n' +
        'Considered by many the greatest wizard of modern times, Professor Dumbledore is particularly famous\n' +
		'for his defeat of the Dark wizard Grindelwald in 1945, for the discovery of the twelve uses of dragon\'s blood\n' +
		'and his work on alchemy with his partner, Nicolas Flamel.\n' +
		'Professor Dumbledore enjoys chamber music and tenpin bowling.\"');
}

/**
 * Handles the dialogue about the library clue.
 */
export async function libraryClue(): Promise<void>
{
    await write('Intrigued, you flip through a few pages and read about something...');
    await write('Apparently, a wizard has successfully produce an Elixir of Life from the Philosopher\'s Stone...\n...and he\'s about 665 years old.');
    await write('The wizard\'s name is Nicolas Flamel.');
}

/**
 * Handles the dialogue about Fluffy with Hagrid.
 */
export async function HagridFluffy(fluffyClue: boolean, lost: boolean): Promise<void>
{
    if (lost) await write("You randomly bump into Hagrid, and as he talks, you decide to follow him to his hut. Hagrid offers you a tea.");
    else await write("You decide to pay Hagrid a visit. As you reach his hut, you see him outside playing with a flute. Hagrid offers you a tea.");    
    
    await write("You and Hagrid are talking about various things, when suddenly he starts talking about his pet, Fluffy.");
    if (fluffyClue)
    {
        await write("It comes up that you have already encountered Fluffy: it was the three-headed dog guarding that mysterious trapdoor.");
        await write("Hagrid adds that if you play music, you can make Fluffy sleep, like it's a well-known thing.");
        await write("He also warn you about going where it is forbidden, but you already know that.");
    }
    else
    {
        await write("As you come to know, Fluffy is a giant three-headed dog, very dangerous and aggressive unless you play music and make him sleep.");
        await write("Hagrid also suggest Fluffy to be somewhere inside the school, which somehow sounds harder to believe than having it as a pet.");
        await write("Hagrid seems very proud of his pet, and apparently even strangers found this sort of thing interesting.");
    }
        await write("You're curious to know more, but Hagrid suddenly seems very reluctant to talk about it any further.");
}

/**
 * Handles the dialogue between Snape and Quirrell about the stone.
 */
export async function SnapeQuirrellTalk(): Promise<void>
{
    await write('You hear a passing conversation.');
    await write('Apparently, Professor Snape and Professor Quirrell are having an argument,\nand the topic seems to be the third floor corridor.');
    await write('You can\'t figure out the details, as you managed to stay hidden.');
    await write('However, you understand that they are arguing about something very important regarding the protection of some secret stuff.');
}

// #endregion MAIN QUEST CLUES

// #region MAIN QUEST TASKS

/**
 * Introduces the Philosopher's Stone quest based on discovered clues.
 * @param clues The mc's clues.
 */
export async function mainQuest_Intro(clues: Clue[]): Promise<void>
{
    await write('During your first year at Hogwarts, you have been hearing some strange rumors around the school...\nFinally, you connect the dots.');
    
    // if (clues.find(c => c.name === 'dumbledores_speech')!.discovered)
    await write('You remember Dumbledore\'s speech about the third-floor corridor, and the danger about it...');
    if (clues.find(c => c.name === 'gringotts_theft')!.discovered) await write('The failed robbery at Gringott\'s, the oldest magical bank of England...');
    if (clues.find(c => c.name === 'chocolate_frog')!.discovered) await write('The connection between Hogwart\'s headmaster Dumbledore and Nicolas Flamel, the famous alchemist...');
    if (clues.find(c => c.name === 'snape_halloween')!.discovered) await write('Professor Snape\'s bleeding wound on Halloween\'s night...');
    if (clues.find(c => c.name === 'library')!.discovered) await write('Nicolas Flamel being the only known maker of the Philosopher\'s Stone...');
    if (clues.find(c => c.name === 'fluffy_talk')!.discovered) await write('Hagrid\'s talk about his pet Fluffy, and some hooded stranger interested in it...');
    if (clues.find(c => c.name === 'snape_quirrell_talk')!.discovered) await write('Professor Snape arguing with Professor Quirrell about something very valuable hidden in the school...');

    await write('You are not sure about the details, but you have a pretty good idea of what is going on.');
    await write('Aware that the Philosopher\'s Stone exists and that it is hidden somewhere inside the Castle, you decide to investigate more about it, starting with the forbidden third-floor corridor.');
    await write('The last door in the corridor is obviously locked.');
}

/**
 * Handles the Fluffy task intro in the Philosopher's Stone quest.
 * @param firstTry Indicates whether this is the first attempt.
 * @param FluffyClue Indicates whether the Fluffy clue has been discovered.
 * @param endofyear Indicates whether it is the end of the year.
 */
export async function Fluffy_intro(firstTry: boolean, FluffyClue: boolean, endofyear: boolean): Promise<void>
{
    let showedText = 'As you enter the door, you ' + (firstTry
        ? 'immediately notice a big, monstrous three-headed dog guarding a trapdoor.' + (FluffyClue ? '\nThat should be Hagrid\'s dog, Fluffy.' : '')
        : 'notice ' + (FluffyClue ? 'Fluffy' : 'the three-headed dog') + ' guarding the trapdoor.');
    
    await write(showedText);

    showedText = firstTry
        ? 'This time, strangely, an enchanted haarp is playing. And the dog is sleeping.'
        : 'An enchanted haarp is playing, and the dog is sleeping.';
    if (endofyear) await write(showedText);
}

/**
 * Handles the Fluffy task ending in the Philosopher's Stone quest.
 * @param success Indicates whether the task was successful.
 * @param FluffyClue Indicates whether the Fluffy clue has been discovered.
 */
export async function Fluffy_ending(success: boolean, FluffyClue: boolean): Promise<void>
{
    if (success)
    {
        let showedText = FluffyClue ? 'Using your knowledge about Fluffy, you manage to calm him down with some music and sneak past him.'
            : 'Fast as hell, you cast a spell, dodge the dog\'s paws with your cool blood and rush into the trapdoor.';
        await write(showedText);
    }
    else
    {
        let showedText = 'Alas, it seems that you cannot get past ' + (FluffyClue ? 'Fluffy' : 'the three-headed dog') + '.\nYou decide to run away from the forbidden room.'
        await write(showedText);
    }
}

/**
 * Handles the Devil's Snare task intro in the Philosopher's Stone quest.
 */
export async function DevilsSnare_intro(): Promise<void>
{
    await write('As soon as you fall down the trapdoor, you fall on a strange plant covering the floor and the walls.');
    await write('The moment you touch it, the plant starts to twist snakelike tendrils around your ankles!');
    await write('You try to free yourself, but the plant tightens its grip around you, making it harder and harder to escape.');
    await write('You can\'t even see anything around you, it\'s very dark...');
}

/**
 * Handles the Devil's Snare task ending in the Philosopher's Stone quest.
 * @param success Indicates whether the task was successful.
 */
export async function DevilsSnare_ending(success: boolean): Promise<void>
{
    if (success) await write('Using your knowledge of magical plants, you manage to free yourself from the Devil\'s Snare and proceed then along a stone passageway, the only way forward...');
    else await write('You fight to pull the plant off you, but eventually succumb.');
}

/**
 * Handles the winged keys task intro in the Philosopher's Stone quest.
 */
export async function WingedKeys_intro(): Promise<void>
{
    await write('You reach the end of the passageway and find a brilliantly lit chamber, with its ceiling arching high above.');
    await write('The room is full of small, jewel-bright birds, fluttering and tumbling all around.');
    await write('On the opposite side of the chamber is a heavy wooden door.');
    await write('You look around the chamber and notice some old broomsticks abandoned in a corner.');
    await write('Squeezing your eyes, you can see that the strange birds are actually winged keys.');
}

/**
 * Handles the winged keys task in the Philosopher's Stone quest.
 * @param success Indicates whether the task was successful.
 */
export async function WingedKeys_ending(success: boolean): Promise<void>
{
    await write('As you touch a broom, the winged keys start chasing you.');
    if (success)
    {
        await write('You manage to get them off and, after a minute\'s weaving about through the whirl of rainbow feathers, you notice a large silver key.');
        await write('With a maneuver worthy of a professional Quidditch player, you reach for it and catch the key.');
        await write('You come down and successfully open the big old door.');
    }
    else
    {
        await write('You try for at least half an hour to get, but you do not catch the key that opens the big door.');
        await write('Furthermore, while you were on the broom, you hit the ceiling and fall to the ground.');
    }
}

/**
 * Handles the wizard's chess task intro in the Philosopher's Stone quest.
 */
export async function WizardsChess_intro(): Promise<void>
{
    await write('The next chamber is so dark you can barely see anything at all, but as you stepped into it, light suddenly flooded the room to reveal an astonishing sight.');
    await write('You\'re standing on the edge of a huge chessboard, behind the black chessmen, which are all taller than you and carved from what looks like black stone.');
    await write('Behind the white pieces you can see another door. You understand that you\'ve got to play your way across the room.');
}

/**
 * Handles the ending of the wizard's chess task in the Philosopher's Stone quest.
 * @param success Indicates whether the task was successful.
 */
export async function WizardsChess_ending(success: boolean): Promise<void>
{
    if (success)
    {
        await write('The challenge is tough, but eventually you manage to overcome it.');
        await write('The white king took off his crown and throws it at your feet. Checkmate!');
    }
    else await write('The game proves to be too difficult, and your opponent checkmates you.');
}

/**
 * Handles the mountain troll task intro in the Philosopher's Stone quest.
 */
export async function mountainTroll_intro(endofyear: boolean): Promise<void>
{
    await write('The next chamber fills your nostrils with a disgusting smell.');
    if (endofyear)
    {
        await write('Eyes watering you see, flat on the floor in front of them, a giant mountain troll, out cold with a bloody lump on its head.');
        await write('Glad you don\'t have to fight that, you step carefully over one of its massive legs.');
    }
    else await write('Before you can do anything, you see a giant Mountain Troll rushing directly at you.');
}

/**
 * Handles the mountain troll task ending in the Philosopher's Stone quest.
 * @param failure Indicates whether the task was failed.
 */
export async function mountainTroll_ending(success: boolean): Promise<void>
{
    if (success)
    {
        await write('With your natural talents, the few skills you learned at school and a bit of luck, you manage to knock out the monster.');
        await write('You nearly cannot believe it.');
    }
    else await write('You try your best to fight off the troll, but eventually succumb.');
}

/**
 * Handles the potion riddle task intro in the Philosopher's Stone quest.
 */
export async function potionRiddle_intro(): Promise<void>
{
    await write('You pull open the next door.');
    await write('Surprisingly, there is nothing very frightening in there: just a table, with seven differently shaped bottles standing on it in a line.');
    await write('But as you step over the threshold, immediately a purple fire springs up behind you in the doorway; and, at the same instant, black flames shoot up in the doorway leading onward. You are trapped.');
    await write('You seize a roll of paper lying next to the bottles. It seems to be a riddle, requiring you to drink the right potion to advance past the black flames.');
}

/**
 * Handles the potion riddle task potions in the Philosopher's Stone quest.
 * @param wine Indicates whether the chosen potion is wine or the useless one.
 */
export async function potionRiddle_useless(wine: boolean): Promise<void>
{
    if (wine) await write('You choose the wrong bottle. Luckily, it was just wine.');    
    else
    {
        await write('You drink the bottle. Nothing seems different, so you quickly try both fires...');
        await write('The purple flames are cool on your skin, but the black ones hurt you a bit.');
    }
}

/**
 * Handles the potion riddle task ending in the Philosopher's Stone quest.
 * @param failure Indicates whether the task was failed.
 */
export async function potionRiddle_ending(success: boolean): Promise<void>
{
    if (success)
    {
        await write('Using your logical skills and your talent in Potions, you figure out the right bottle in a minute.');
        await write('You drink the potion. You quickly try both fires...');
        await write('You feel the black flames cool on your skin: you can move on to the next room!');
    }
    else await write('Alas, you choose the wrong potion and were poisoned.');
}

/**
 * Handles the mirror intro in the Philosopher's Stone quest.
 */
export async function mirror_intro(endofyear: boolean, discoveredMirror: boolean): Promise<void>
{
    await write('You open the last door.');
    if (endofyear)
    {
        await write('To your surprise, there is already someone in the last chamber.');
        await write('It\'s Professor Quirrell.');
        await write(discoveredMirror ? 'He is standing in front of the Mirror of Erised.'
            : 'He is standing in front of a magnificent mirror, with an ornate gold frame, standing on two clawed feet.'
        );
        await write('It\'s clear that Quirrell did not expect to see YOU here.');
        await write('As he starts talking, you notice that his voice seems a lot different than before...\nIt\'s not his usual quivering treble, but rather cold and sharp.');
        await write('Before you can do anything, Quirrell snaps his fingers: immediately, ropes sprang out of thin air and wrapped themselves tightly around you.');
        await write('You nearly cannot believe, as he explains that he is going to steal the Philosophers\' Stone. He proceeds to examine the mirror.');
        await write('Quirrell walks around the mirror, and you look into it.\nThere, you can see it: your reflection, smiling at you.');
        await write('Inside the mirror, you see yourself put your hand into your pocket and pull out a blood-red stone.');
        await write('After putting the Stone back in the pocket, you feel something heavy drop into the real one.');
    }
}

/**
 * Handles the failure ending of the Philosopher's Stone quest.
 */
export async function mainQuest_HospitalFailure(house: hogwartsHouse): Promise<void>
{
    await write('You wake up, a few days later, in the Hospital Wing.');
    await write('As you open your eyes, you notice that there is only a person in the room.');
    await write('It\'s the headmaster, who seems to be eating some candy from a bag on your bedside table.');
    await write('Professor Dumbledore does not spend many words investigating why you were in the dungeon...');
    await write('Just as you begin to wonder if he could read minds, he recognizes the qualities you have demonstrated.');
    await write('Dumbledore awards 10 points to ' + house + '.');
}

/**
 * Handles the mid-year ending of the Philosopher's Stone quest.
 * @param house The mc's Hogwarts House.
 */
export async function mainQuest_MidYearEnding(house: hogwartsHouse): Promise<void>
{
    await write('You open the last door.');
    await write('The room is empty, except for a big chest. You try to open it, but the chest remains closed.');
    await write('Not a long after, Professor Dumbledore himself joins you into the chamber.');
    await write('Even he seems stunned by your impressive feat.');
    await write('After you both moved to his office, he listens to you telling about the trials you have just overcome.');
    await write('When you\'re done talking, he smiles, and awards 50 points to ' + house + '.');
}

/**
 * Handles the good ending of the Philosopher's Stone quest.
 * @param house The mc's Hogwarts House.
 */
export async function mainQuest_GoodEnding(house: hogwartsHouse): Promise<void>
{
    await write('All the knowledge learned at school bears fruit, as you manage to defeat Quirrell.');
    await write('As the HORROR on the back of his head run away, both of you collapse on the ground.');
    await write('Not a long after, Professor Dumbledore himself joins you into the chamber.');
    await write('Just have just saved the whole school, and maybe more than that: even he seems stunned by your impressive feat.');
    await write('After you both moved to his office, he listens to you telling about the trials you have just overcome.');
    await write('Professor Dumbledore decides to reward you with a special commendation for the services rendered to the school of Hogwarts.');
    await write('Also, he awards 50 points to ' + house + '.');
}

/**
 * Handles the bad ending of the Philosopher's Stone quest.
 * @param house The mc's Hogwarts House.
 */
export async function mainQuest_BadEnding(): Promise<void>
{
    await write('Alas, you can do nothing against him.');
    await write('Angry as you never saw him, Quirrell knocks you out with a mysterious spell.');
    await write('You wake up, nearly a week later, in the Hospital Wing.');
    await write('Professor Dumbledore is with you, and as he explains, Quirrell\'s spell might have damaged you.');
    await write('Try as you might to remember, your recollections of the past few months are patchy.');
}

// #endregion MAIN QUEST TASKS