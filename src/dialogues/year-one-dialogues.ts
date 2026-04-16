
import { showText, spinEqual } from "../utilities/_index";
import { Character, Clue, hogwartsHouseName, subject, bloodStatus, race } from "../basis/_index";

/**
 * Handles the sorting of the mc's blood status.
 */
export async function sortBlood(blood: bloodStatus)
{
    switch (blood)
    {
        case 'pure':
            await showText('Your parents are both wizards.\nYou were born a pure-blood wizard, with a long lineage of magical ancestors.\nYour family, one of the sacred twenty-eight, has always valued tradition and the old ways of magic.');
            break;
        case 'half':
            await showText('Your parents do not come both from ancient magical lineages.\nYou are a half-blood wizard, with a rich and mixed ancestry.');
            break;
        case 'mud':
            await showText('Your parents are muggles.\nYou are a Muggle-born wizard, with no magical ancestry at all. Your magical abilities are a rare and precious gift.');
            break;
    }
}

export async function sortRace(race: race)
{
    switch (race)
    {
        case 'human': 
            await showText('You are human.');
            break;
        case 'half-giant':
            await showText('You are half human, half giant, possessing strength and magic resistance above that of a normal human.');
            break;
        case 'half-veela':
            await showText('You are half human, half veela, inheriting beauty and charm from your veela ancestry.');
            break;
        case 'werewolf':
            await showText('Alas, when you were a child, you were bitten by a werewolf.\nLycanthropy is a terrible curse, but you have learned to manage it with the help of the Wolfsbane.\nYou will forever have to be careful during the full moon.');
            break;
    }
}

/**
 * Handles the arrival at Hogwarts and the sorting ceremony.
 */
export async function arrivalAtHogwarts(): Promise<void>
{
    await showText('On the first of September, you board the Hogwarts Express from platform nine and three-quarters at King\'s Cross Station.');
    await showText('By the same evening, you arrive at the magnificent and mysterious Hogwarts Castle.');
    await showText('In the Great Hall, under a velvety black ceiling dotted with stars, the Sorting Ceremony is about to begin...');
    await showText('Everyone seems very excited about it.');
    await showText('The Sorting Hat is brought in, looking old and worn.\nHe presents the four houses: Gryffindor, Hufflepuff, Ravenclaw and Slytherin.');
    await showText('After a while, the Sorting Hat is placed on your head. It feels a bit heavy and itchy.');
    await showText('"...Hmmmm... Interesting... Very interesting...", the hat recites.');
}

/**
 * Handles Dumbledore's speech after the sorting ceremony.
 * @param clue Whether the player has the clue about the third-floor corridor.
 */
export async function dumbledoresSpeech(clue: boolean): Promise<void>
{
    await showText('After the sorting ceremony, a silver-haired man stands up from his golden chair.');
    await showText('It\'s Albus Dumbledore, Hogwarts\' headmaster.');
    await showText('He says few words about the new year and the school.');
    await showText('"...And finally, I must tell you that this year, the third-floor corridor\non the right-hand side is '
        + (clue ? 'OUT OF BOUNDS' : 'out of bounds') + ' to everyone who does not wish to die a very painful ' + (clue ? 'DEATH."' : 'death."'));
    await showText('You start to laugh... But everyone else seems to take these words seriously.');
    if(clue) await showText('You wonder what could be in that corridor to deserve such a warning...');
}

export async function flyingLesson(): Promise<void>
{
    await showText('Madame Hooch makes seven circles of light appear in the air, all at different heights and distances from each other.');
    await showText('She explains that you\'ll take turns trying to get through as many hoops as possible.');
    await showText('Each one will have two attempts, and you can practice on the broom while the others are trying.');   
}

/**
 * Handles the Quidditch selection event.
 * @param captain The name of the Quidditch captain.
 * @param house The house of the mc.
 */
export async function QuidditchSelection(captain: string, house: string): Promise<void>
{
    await showText('The Quidditch tryouts are held by ' + captain + ', the ' + house + ' captain.');
    await showText('After a brief explanation of the game, you are asked to demonstrate your flying skills.');
    await showText('Do you pass the Quidditch selection?');
}

/**
 * Simulates a Quidditch game between two houses.
 * @param houseA The winner house.
 * @param houseB The loser house.
 */
export async function quidditchMatch(houseA: hogwartsHouseName, houseB: hogwartsHouseName): Promise<void>
{
    await showText(spinEqual([
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
    await showText('Since you are struggling with ' + subject + ', you decide to spend some time studying it in the library.');
    await showText('You find a quiet corner and immerse yourself in the books.');
    if (serious) await showText('After hours of intense study, you feel like you have a much better grasp of the subject now.');
    else await showText ('Your knowledge of ' + subject + ' has improved.');
}

/**
 * Handles the conversation with a ghost.
 * @param ghost The ghost character.
 */
export async function ghostTalk(ghost: Character<'Creature'>): Promise<void>
{
    await showText('While you were minding your business in the common room, you suddenly see a ghostly figure floating in the air.');
    await showText('It\'s ' + ghost.longname + ', the ghost of ' + ghost.house + '.');
    await showText('You start talking with ' + ghost.name + ', and you find out that ' + (ghost.male ? 'he' : 'she') + ' has a lot of interesting stories to tell about the history of Hogwarts.');
}

export async function stairsChange(): Promise<void>
{
    await showText('You were warned that the Hogwarts stairs like to change, but you find yourself in the middle of it nonetheless.');
    await showText('You try to find your way back, but the stairs keep changing and you end up completely lost in the castle.');
}

export async function HagridsHelp(): Promise<void>
{
    await showText('Luckily you bump into Hagrid, who offers to help you find your way back.');
    await showText('Hagrid is very friendly and kind, and you have a nice conversation with him while he guides you back to your dormitory.');
    await showText('You feel grateful for Hagrid\'s help and kindness.');
}

export async function quidditchPractice(): Promise<void>
{
    await showText('You attend a Quidditch practice session, where you practice your flying skills and bond with your teammates.');    
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
        await showText('You decide to pay a visit to Moaning Myrtle.');
        await showText('She is very happy to see you, and she tells you all about her life as a ghost and her experiences in Hogwarts.');
        await showText('You have a nice conversation with her.');
        await showText('A very long conversation with her.');
        await showText('After what feels like hours, you decide to take your leave.');
    }
    else
    {
        if (male) await showText('Without really knowing how, you find yourself in the girl\'s bathroom on the second floor.\nYou\'re not supposed to be here...');
        else await showText('You go to the girls\' bathroom, but you find yourself in a very eerie and unsettling place.');

        await showText('Suddenly, you hear someone softly crying. Just a moment ago you could have sworn you were completely alone...');
        await showText('You come close to the cubicle where the crying comes.');
        await showText('Suddenly, from the closed door emerges the glum face of a squat girl, hidden behind lank hair and thick glasses.');
        await showText('For the next 45 minutes at least, you get stuck talking with Moaning Myrtle.');
        
        if (male) await showText('You would never guessed how many small tragedies could unite a surprising number of girls.');
        else await showText('You would never have imagined how perverted some students could be.');
    
        await showText('As you ponder how many different lives have intertwined in front of those toilets, you notice Mirtilla smiling at you.');
        await showText('She seems very happy to have someone to talk with again, after almost a year.');
        await showText('You promise to come visit her again sometime.');
    }
}

/**
 * Handles the discovery of the Mirror of Erised.
 */
export async function mirrorOfErised(): Promise<void>
{
    await showText('Wandering in the Castle, you discover an unused classroom.');
    await showText('Propped against the wall, there is something that does not look as if it belong there...');
    await showText('...something that look as if someone just put it there, to keep it out of the way.');
    await showText('It is a magnificent mirror, as high as the ceiling, with an ornate gold frame, standing on two clawed feet.');
    await showText('There is an inscription carved around the top: \'Erised stra ehru oyt ube cafru oyt on wohsi\'.');
    await showText('You stare into the Mirror of Erised.');

    // add random vision (?)
    
    await showText('After a quite long time, you hear a voice from behind you.');
    await showText('"I see that you, like many before you, have discovered the delights of the Mirror of Erised."');
    await showText('You turn around and see that it is Professor Dumbledore, the headmaster, who has spoken.');
    await showText('The Professor starts talking about the mirror and what you see in it.');
    await showText('The two of you have a long and very interesting conversation, about desires and choices.');
    await showText('Professor Dumbledore finally states that the mirror will soon be moved and will have another purpose.');
    await showText('He also emphasizes his desire that you not try to search for it again, for your own good.');
}

// #region REMEMBRALL SIDEQUEST

/**
 * Handles the introduction to the Remembrall sidequest.
 */
export async function remembrallIntro(): Promise<void>
{
    await showText('During the first exercise, you notice a boy struggling with his broom.');
    await showText('It\'s Neville Longbottom, a clumsy-looking Gryffindor student.');
    await showText('Suddenly he takes flight, and starts speeding around dangerously!');
    await showText('Madam Hooch, the flying instructor, blows her whistle and tries to stop him, without success.');
    await showText('As everyone begins to panic, Neville falls from the broom and crashes to the ground!');
    await showText('Madam Hooch rushes to his side and helps him up, taking him to the infirmary.');
    await showText('While leaving, she makes VERY CLEAR that no one is to fly until she comes back.');
    await showText('As Neville is taken away, you notice Draco Malfoy smirking and holding a small, round object.');
    await showText('It\'s Neville\'s Remembrall! He must have lost it during the fall.\nDraco is making fun of Neville with his friends.');
}

/**
 * Bad ending.
 */
export async function remembrallNinja(success: boolean): Promise<void>
{
    if (success)
    {
        await showText('You swiftly grab the Remembrall from Draco\'s hand!');
        await showText('You managed to keep it from him until the teacher arrives.');
        await showText('Draco now despises you. He squeaks something about his father.');
        await showText('In the afternoon, you give it back to Neville in the infirmatory. He is very grateful to you.');
    }
    else
    {
        await showText('Alas, as you try to snatch the Remembrall, Draco quickly pulls it away.');
        await showText('You fall to the ground, and Draco laughs at you.');
        await showText('Draco now despises you. He squeaks something about his father.');
    }
}

export async function remembrallTrialIntro(): Promise<void>
{
    await showText('You decide to ask Draco for the Remembrall back: it\'s just the right thing to do.');
    await showText('Draco taunts you, flying quickly up and daring you to catch the remembrall.');
    await showText('You realize that you need to act fast to get it back.');
    await showText('As you reach for it, Draco throws the Remembrall high into the air, very far away. Do you catch it?');
}

export async function remembrallTrial(miss: boolean): Promise<void>
{
    if (miss)
    {
        await showText('You jump to catch the Remembrall, but miss it as it falls back down.');
        await showText('Draco laughs at you, and flies away with the Remembrall.');
    }
    else
    {
        await showText('You leap into the air and, in a move worthy of a Quidditch player, catch the Remembrall!\nEverybody cherishes your deed.');
        await showText('Draco looks furious as you retrieve the Remembrall.');
        await showText('In the afternoon, you give it back to Neville in the infirmatory. He is very grateful to you.');
    }
}

// #endregion REMEMBRALL SIDEQUEST

// #region TROLL SIDEQUEST

export async function trollIntro(): Promise<void>
{
    await showText('On Halloween night, something bizarre happens.');
    await showText('Professor Quirrell rushes into the Great Hall, his turban askew and terror on his face.');
    await showText('Everyone stared as he reached Professor Dumbledore\'s chair, slumped against the table, and gasped,' +
        "\n\"Troll -- in the dungeons -- thought you ought to know.\"");
    await showText('He then sink to the floor in a dead faint.\nThere is an uproar.');
    await showText('Professor Dumbledore quickly orders everyone to stay calm,\nand soon the heads of houses and the prefects start bringing everyone to their dormitories.');
}

export async function trollBadLuck(): Promise<void>
{
    await showText('Unfortunately, you were at the bathroom until a few moments before that happened.');
    await showText('You suddenly hear a loud roar echoing through the corridors.');
    await showText('You reach the corner, and see a huge troll rampaging through the hallways!');
    await showText('It seems very angry and dangerous, and it\'s coming directly at you.');
    await showText('What do you do?');
}

export async function trollRescue(): Promise<void>
{
    await showText('You noticed that you haven\'t seen Hermione around since before the chaos started.');
    await showText('You know that she wasn\'t feeling right, and that she always goes to the bathroom when she\'s upset.');
    await showText('The girls\' bathroom is just ahead, but it is near the dungeon, so you rush there to check on her.');
    await showText('As you enter, you see the monstrous tall figure of the troll! He\'s looming over Hermione, who is frozen in fear.');
    await showText('What do you do?');
}

/**
 * Coward ending.
 */
export async function trollCoward(): Promise<void>
{
    await showText('At the decisive moment, you find yourself a coward. You run away.');
    await showText('You hear Hermione\'s terrified scream behind you as the troll grabs her.');
    await showText('You manage to reach the dormitories safely, but you feel terrible for abandoning Hermione.');
    await showText('Later, you find out that Hermione was rescued by Harry Potter and Ron Weasley.');
}

/**
 * Escape ending.
 */
export async function trollEscape(): Promise<void>
{
    await showText('You manage to escape the troll\'s grasp and run back to the safety of the dormitories.');
    await showText('Once inside, you talk about what just happened with the other students.');
    await showText('After a while, all gather around you to hear your story.\nThey are all very interested in knowing all the details of the troll.');
    await showText('You strengthen your bonds with your housemates!');
}

export async function troll_badEnding(): Promise<void>
{
    await showText ('You freeze in terror and, before you can try anything, the troll hits you pretty hard.');
    await showText ('You wake up the day after, in the Hospital Wing.');
    await showText ('You try to explain, but you don\'t remember much.\nYou also can\'t remember well the last two weeks.');
    await showText ('As Madam Pomfrey says, it may take some time to recover all the memories.');
    await showText('This accident made you fall behind in your studies.');
}

/**
 * Good ending - defeating the troll (and rescuing Hermione / being rescued by Hermione).
 * @param friends True if the mc is friends with Hermione.
 * @param house The mc house.
 */
export async function troll_goodEnding(friends: boolean, house: hogwartsHouseName, spell: boolean): Promise<void>
{
    if (spell)
    {
        await showText('You cast the first spell that comes to your mind.');
        await showText('The troll\'s club flies suddenly out of the troll\'s hand, rises high, high up into the air,' +
                    "\nturns slowly over and drops, with a sickening crack, onto its owner's head.");
        await showText('The troll sways on the spot and then falls flat on its face, with a thud that made the whole room tremble.');
        await showText('A moment later, Professor McGonagall comes bursting into the room, closely followed by Snape, with Quirrell bringing up the rear.');
        await showText('You notice that Snape has a still bleeding wound on his leg. He immediately covers it.');
        if (friends)
        {
            await showText('Hermione explains them that it was all her fault, and that you are her savior.');
            await showText('As they find out what you did, they award ' + house + ' 10 points for your feat.');
            await showText('They also take 5 points from Gryffindor, for the danger Hermione put herself in.');
        }
        else
        {
            await showText('As they find out what you did, they take 5 points from ' + house + ', for your recklessness.');
            await showText('Apparently, another student tried to fight the troll, but was unsuccessful: Hermione Granger (Gryffindor).');
            await showText('The professors take 5 points from Gryffindor, for the danger Hermione put herself in.');
            await showText('They also award 15 points to ' + house + ', for the impressive feat you accomplished.');
        }
        await showText('After tonight, you become quite popular among your peers.');
    }
    else
    {
        await showText ('You grab an old broom from nearby and use it to attack the troll.');
        await showText ('You hit the troll on the knees. It\'s not very effective.');
        await showText ('As the monster is about to strike you, something hits it from behind.');
        await showText ('The monster turns around. It\'s Hermione Granger!');

        if (!friends) await showText('Everybody knows her as the best student in your year already.');

        await showText ('She quickly uses another spell to make the troll hit itself.');
        await showText ('The troll falls to the ground, unconscious.');
        await showText ('Professor McGonagall comes bursting into the room, closely followed by Snape, with Quirrell bringing up the rear.');
        await showText ('You notice that Snape has a still bleeding wound on his leg. He immediately covers it.');

        await showText('As they find out what you two did, they take 5 points from ' + house + ', for the danger you put yourself in.');
        await showText('They also award 10 points to Gryffindor, for the courage and the skills Hermione showed.');

        await showText('Tonight\'s events will make you more popular.');
    }
}

// #endregion TROLL SIDEQUEST

// #region DARK FOREST SIDEQUEST

/**
 * Handles the introduction to the Dark Forest sidequest with Hagrid.
 */
export async function DarkForestIntro(firstTime: boolean, draco: boolean): Promise<void>
{
    if (firstTime) await showText('Hagrid shows up and leaves to you the punishment\s explaining.');
    else
    {
        await showText('Hagrid shows up and explains the punishment: the two of you will help collecting some unicorn hair in the forest.');
        if (draco) await showText('Draco seems terrified, and tries to object by threatening his father\'s intervention, but Hagrid ignores him.');
    }

    await showText('After having prepared the necessary equipment, Hagrid takes the two of you and his dog, Fang, and you all enter the Dark Forest.');
    if (firstTime) await showText('As you wander through the woods, the gatekeeper tells you how he recently found some dead specimens.');
    
    await showText('He shows you some unicorn\'s blood.');

    if (firstTime) await showText('Suddenly, Hagrid\'s dog breaks free, and runs into the woods. Hagrid hurries after him, telling you to go back to the hut.');
    else
    {
        await showText('This time too, Fang breaks free and runs into the woods. You wonder what\'s wrong with him.');
        await showText('You assure Hagrid that you remember the way back, so he follows Fang\'s trail and you head towards the hut.');
    }
}

/**
 * Handles the good ending of the Dark Forest sidequest.
 * @param buddy The name of the student that accompanies the mc in the forest.
 */
export async function DarkForest_GoodEnding(buddy: string): Promise<void>
{
    await showText('For nearly half an hour, you walk through the woods. Both you and ' + buddy + ' collect some unicorn hair.');
    await showText('As you walk back to the hut, you take the opportunity to talk with ' + buddy + ' and you get to know each other better.');
    await showText('After a while, the two of you are back to Hagrid\'s hut.');
    await showText('He seems very happy to see you back, and after thanking you for the unicorn hair, he lets you go without a word.');
}

/**
 * Handles the bad ending of the Dark Forest sidequest.
 * @param buddy The name of the student that accompanies the mc in the forest.
 */
export async function DarkForest_BadEnding(buddy: string): Promise<void>
{
    await showText('For nearly half an hour, you walk through the woods. Both you and ' + buddy + ' collect some unicorn hair.');
    await showText('As you walk deeper and deeper into the forest the path becomes harder to follow, until you realize you are completely lost.');
    await showText('At some point, ' + buddy + ' notice something strange ahead. You both decide to check it out, and you find yourselves in front of a clearing.');
    await showText('You cannot clearly distinguish what is in the middle of the clearing, but you can hear some strange noises coming from there.');
    await showText('Suddenly, a group of centaurs emerge from the shadows and surround you. They look very angry.');
    await showText('The centaurs are not angry at you however: they seems to be mad at a figure in the middle of the clearing, who just got up from...\na unicorn\s dead body.');
    await showText('You can see the unicorn\'s blood dripping from the figure\'s hands... and mouth.\nThe centaurs chase it away.');
    await showText('The centaurs then escort you, still trembling from what you witness, back to Hagrid\'s hut.');
    await showText('One of the centaurs tells Hagrid what happened, and adds something about being lucky because centaurs "don\'t harm children".');
    await showText('Neither you nor ' + buddy + ' can ever forget this night.');
}

// #endregion DARK FOREST SIDEQUEST

// #region NORBERT SIDEQUEST

/**
 * Norbert is born and Hagrid asks to keep it a secret.
 */
export async function meetingNorbert(lost: boolean): Promise<void>
{
    if (lost) await showText('You randomly bump into a worried Hagrid, so you decide to follow him to his hut, where he offers you a tea.');
    else await showText('You decide to pay a visit to Hagrid, and find him in his hut, looking a bit worried.');

    await showText('After a while, he breaks the silence and tells you what is bothering him.');
    await showText('Hagrid has a problem: he has won a dragon egg in a card game, and now it\'s about to hatch!');
    await showText('He is very excited about it, but also very scared, because it\'ll be the first time for him taking care of a dragon.');
    await showText('Just when he is about to ask you for help, the egg starts shaking and cracking, and a baby dragon emerges from it!');
    await showText('Hagrid is overjoyed, and decides to name the dragon "Norbert".');
    await showText('He asks you to keep the dragon thing a secret, at least for now.');
}

/**
 * Norbert needs to be safely and secretly taken away.
 */
export async function savingNorbert(): Promise<void>
{
    await showText('In the last weeks, Norbert has doubled in size.');
    await showText('Hagrid grows more and more worried about anyone to find out the illegal dragon.');
    await showText('You decide to confront him on the dragon in the room.');
    await showText('After a long discussion, Hagrid decides to entrust Norbert to Charlie Weasley, who studies dragons in Romania.');
    await showText('Charlie and his friends can pick up Norbert the next weekend, but they have to do it in secrecy.');
    await showText('On that night, Hagrid leaves Norbert to your cares: you have to bring him to the tallest tower.');
}

/**
 * Handles Norbert sidequest's bad ending.
 * @param HarryHelp Wheter Harry helped the mc or not.
 */
export async function NorbertFailure(HarryHelp: boolean): Promise<void>
{
    if (HarryHelp) await showText('Despite Harry\'s invisibility cloak, you stumbled and are caught by Filch.');
    else await showText('Unfortunately, you stumble and are caught by Filch.');

    await showText('Norbert\'s cage opens and the little dragon flies away: luckily, he quickly reaches the sky.');
    await showText('You see Norbert fly away, followed by some broomstick in the distance.');
}

/**
 * Handles Norbert sidequest's good ending.
 * @param HarryHelp Wheter Harry helped the mc or not.
 */
export async function NorbertSuccess(HarryHelp: boolean): Promise<void>
{
    await showText('Thanks to your skills' + (HarryHelp ? ' and Harry\'s help' : '') + ', you managed to reach the roof of the tallest tower of Hogwarts\' Castle.');
    await showText('After a while, Charlie Weasley and his friends come flying on their broomsticks.');
    await showText('You saved Norbert!');
}

// #endregion NORBERT SIDEQUEST

// #region MAIN QUEST CLUES

/**
 * Handles the dialogue about the Gringotts robbery.
 */
export async function GringottsTheft(): Promise<void>
{
    await showText('Apparently Gringott\'s, the oldest magical bank of England, has suffered a robbery.');
    await showText('The thieves were able to bypass the bank\'s security measures and enter one of the deepest vaults.');
    await showText('However, it seems that nothing was stolen, as the broken-in vault had been accidentally emptied the day before...');
}

/**
 * Handles the dialogue about Dumbledore's chocolate frog.
 * @param friendName The name of the friend giving the chocolate frog.
 */
export async function chocolateFrog(friendName: string): Promise<void>
{
    await showText(friendName + ' gifts a chocolate frog to you.');
    await showText('The card reads as follows.');
    await showText('\"Albus Dumbledore, currently Headmaster of Hogwarts.\n' +
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
    await showText('Intrigued, you flip through a few pages and read about something...');
    await showText('Apparently, a wizard has successfully produce an Elixir of Life from the Philosopher\'s Stone...\n...and he\'s about 665 years old.');
    await showText('The wizard\'s name is Nicolas Flamel.');
}

/**
 * Handles the dialogue about Fluffy with Hagrid.
 */
export async function HagridFluffy(fluffyClue: boolean, lost: boolean): Promise<void>
{
    if (lost) await showText('You randomly bump into Hagrid, and as he talks, you decide to follow him to his hut. Hagrid offers you a tea.');
    else await showText('You decide to pay Hagrid a visit. As you reach his hut, you see him outside playing with a flute. Hagrid offers you a tea.');    
    
    await showText('You and Hagrid are talking about various things, when suddenly he starts talking about his pet, Fluffy.');
    if (fluffyClue)
    {
        await showText('It comes up that you have already encountered Fluffy: it was the three-headed dog guarding that mysterious trapdoor.');
        await showText('Hagrid adds that if you play music, you can make Fluffy sleep, like it\'s a well-known thing.');
        await showText('He also warn you about going where it is forbidden, but you already know that.');
    }
    else
    {
        await showText('As you come to know, Fluffy is a giant three-headed dog, very dangerous and aggressive unless you play music and make him sleep.');
        await showText('Hagrid also suggest Fluffy to be somewhere inside the school, which somehow sounds harder to believe than having it as a pet.');
        await showText('Hagrid seems very proud of his pet, and apparently even strangers found this sort of thing interesting.');
    }
        await showText('You\'re curious to know more, but Hagrid suddenly seems very reluctant to talk about it any further.');
}

/**
 * Handles the dialogue between Snape and Quirrell about the stone.
 */
export async function SnapeQuirrellTalk(): Promise<void>
{
    await showText('You hear a passing conversation.');
    await showText('Apparently, Professor Snape and Professor Quirrell are having an argument,\nand the topic seems to be the third floor corridor.');
    await showText('You can\'t figure out the details, as you managed to stay hidden.');
    await showText('However, you understand that they are arguing about something very important regarding the protection of some secret stuff.');
}

// #endregion MAIN QUEST CLUES

// #region MAIN QUEST TASKS

/**
 * Introduces the Philosopher's Stone quest based on discovered clues.
 * @param clues The mc's clues.
 */
export async function mainQuest_Intro(clues: Clue[]): Promise<void>
{
    await showText('During your first year at Hogwarts, you have been hearing some strange rumors around the school...\nFinally, you connect the dots.');
    
    // aggiungere check su indizio 0 (?)
    await showText('You remember Dumbledore\'s speech about the third-floor corridor, and the danger about it...');
    if (clues.find(c => c.name === 'gringotts_theft')!.discovered) await showText('The failed robbery at Gringott\'s, the oldest magical bank of England...');
    if (clues.find(c => c.name === 'chocolate_frog')!.discovered) await showText('The connection between Hogwart\'s headmaster Dumbledore and Nicolas Flamel, the famous alchemist...');
    if (clues.find(c => c.name === 'snape_halloween')!.discovered) await showText('Professor Snape\'s bleeding wound on Halloween\'s night...');
    if (clues.find(c => c.name === 'library')!.discovered) await showText('Nicolas Flamel being the only known maker of the Philosopher\'s Stone...');
    if (clues.find(c => c.name === 'fluffy_talk')!.discovered) await showText('Hagrid\'s talk about his pet Fluffy, and some hooded stranger interested in it...');
    if (clues.find(c => c.name === 'snape_quirrell_talk')!.discovered) await showText('Professor Snape arguing with Professor Quirrell about something very valuable hidden in the school...');

    await showText('You are not sure about the details, but you have a pretty good idea of what is going on.');
    await showText('Aware that the Philosopher\'s Stone exists and that it is hidden somewhere inside the Castle, you decide to investigate more about it, starting with the forbidden third-floor corridor.');
    await showText('The last door in the corridor is obviously locked.');
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
    
    await showText(showedText);

    showedText = firstTry
        ? 'This time, strangely, an enchanted haarp is playing. And the dog is sleeping.'
        : 'An enchanted haarp is playing, and the dog is sleeping.';
    if (endofyear) await showText(showedText);
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
        await showText(showedText);
    }
    else
    {
        let showedText = 'Alas, it seems that you cannot get past ' + (FluffyClue ? 'Fluffy' : 'the three-headed dog') + '.\nYou decide to run away from the forbidden room.'
        await showText(showedText);
    }
}

/**
 * Handles the Devil's Snare task intro in the Philosopher's Stone quest.
 */
export async function DevilsSnare_intro(): Promise<void>
{
    await showText('As soon as you fall down the trapdoor, you fall on a strange plant covering the floor and the walls.');
    await showText('The moment you touch it, the plant starts to twist snakelike tendrils around your ankles!');
    await showText('You try to free yourself, but the plant tightens its grip around you, making it harder and harder to escape.');
    await showText('You can\'t even see anything around you, it\'s very dark...');
}

/**
 * Handles the Devil's Snare task ending in the Philosopher's Stone quest.
 * @param success Indicates whether the task was successful.
 */
export async function DevilsSnare_ending(success: boolean): Promise<void>
{
    if (success) await showText('Using your knowledge of magical plants, you manage to free yourself from the Devil\'s Snare and proceed then along a stone passageway, the only way forward...');
    else await showText('You fight to pull the plant off you, but eventually succumb.');
}

/**
 * Handles the winged keys task intro in the Philosopher's Stone quest.
 */
export async function WingedKeys_intro(): Promise<void>
{
    await showText('You reach the end of the passageway and find a brilliantly lit chamber, with its ceiling arching high above.');
    await showText('The room is full of small, jewel-bright birds, fluttering and tumbling all around.');
    await showText('On the opposite side of the chamber is a heavy wooden door.');
    await showText('You look around the chamber and notice some old broomsticks abandoned in a corner.');
    await showText('Squeezing your eyes, you can see that the strange birds are actually winged keys.');
}

/**
 * Handles the winged keys task in the Philosopher's Stone quest.
 * @param success Indicates whether the task was successful.
 */
export async function WingedKeys_ending(success: boolean): Promise<void>
{
    await showText('As you touch a broom, the winged keys start chasing you.');
    if (success)
    {
        await showText('You manage to get them off and, after a minute\'s weaving about through the whirl of rainbow feathers, you notice a large silver key.');
        await showText('With a maneuver worthy of a professional Quidditch player, you reach for it and catch the key.');
        await showText('You come down and successfully open the big old door.');
    }
    else
    {
        await showText('You try for at least half an hour to get, but you do not catch the key that opens the big door.');
        await showText('Furthermore, while you were on the broom, you hit the ceiling and fall to the ground.');
    }
}

/**
 * Handles the wizard's chess task intro in the Philosopher's Stone quest.
 */
export async function WizardsChess_intro(): Promise<void>
{
    await showText('The next chamber is so dark you can barely see anything at all, but as you stepped into it, light suddenly flooded the room to reveal an astonishing sight.');
    await showText('You\'re standing on the edge of a huge chessboard, behind the black chessmen, which are all taller than you and carved from what looks like black stone.');
    await showText('Behind the white pieces you can see another door. You understand that you\'ve got to play your way across the room.');
}

/**
 * Handles the ending of the wizard's chess task in the Philosopher's Stone quest.
 * @param success Indicates whether the task was successful.
 */
export async function WizardsChess_ending(success: boolean): Promise<void>
{
    if (success)
    {
        await showText('The challenge is tough, but eventually you manage to overcome it.');
        await showText('The white king took off his crown and throws it at your feet. Checkmate!');
    }
    else await showText('The game proves to be too difficult, and your opponent checkmates you.');
}

/**
 * Handles the mountain troll task intro in the Philosopher's Stone quest.
 */
export async function mountainTroll_intro(endofyear: boolean): Promise<void>
{
    await showText('The next chamber fills your nostrils with a disgusting smell.');
    if (endofyear)
    {
        await showText('Eyes watering you see, flat on the floor in front of them, a giant mountain troll, out cold with a bloody lump on its head.');
        await showText('Glad you don\'t have to fight that, you step carefully over one of its massive legs.');
    }
    else await showText('Before you can do anything, you see a giant Mountain Troll rushing directly at you.');
}

/**
 * Handles the mountain troll task ending in the Philosopher's Stone quest.
 * @param failure Indicates whether the task was failed.
 */
export async function mountainTroll_ending(success: boolean): Promise<void>
{
    if (success)
    {
        await showText('With your natural talents, the few skills you learned at school and a bit of luck, you manage to knock out the monster.');
        await showText('You nearly cannot believe it.');
    }
    else await showText('You try your best to fight off the troll, but eventually succumb.');
}

/**
 * Handles the potion riddle task intro in the Philosopher's Stone quest.
 */
export async function potionRiddle_intro(): Promise<void>
{
    await showText('You pull open the next door.');
    await showText('Surprisingly, there is nothing very frightening in there: just a table, with seven differently shaped bottles standing on it in a line.');
    await showText('But as you step over the threshold, immediately a purple fire springs up behind you in the doorway; and, at the same instant, black flames shoot up in the doorway leading onward. You are trapped.');
    await showText('You seize a roll of paper lying next to the bottles. It seems to be a riddle, requiring you to drink the right potion to advance past the black flames.');
}

/**
 * Handles the potion riddle task potions in the Philosopher's Stone quest.
 * @param wine Indicates whether the chosen potion is wine or the useless one.
 */
export async function potionRiddle_useless(wine: boolean): Promise<void>
{
    if (wine) await showText('You choose the wrong bottle. Luckily, it was just wine.');    
    else
    {
        await showText('You drink the bottle. Nothing seems different, so you quickly try both fires...');
        await showText('The purple flames are cool on your skin, but the black ones hurt you a bit.');
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
        await showText('Using your logical skills and your talent in Potions, you figure out the right bottle in a minute.');
        await showText('You drink the potion. You quickly try both fires...');
        await showText('You feel the black flames cool on your skin: you can move on to the next room!');
    }
    else await showText('Alas, you choose the wrong potion and were poisoned.');
}

/**
 * Handles the mirror intro in the Philosopher's Stone quest.
 */
export async function mirror_intro(endofyear: boolean, discoveredMirror: boolean): Promise<void>
{
    await showText('You open the last door.');
    if (endofyear)
    {
        await showText('To your surprise, there is already someone in the last chamber.');
        await showText('It\'s Professor Quirrell.');
        await showText(discoveredMirror ? 'He is standing in front of the Mirror of Erised.'
            : 'He is standing in front of a magnificent mirror, with an ornate gold frame, standing on two clawed feet.'
        );
        await showText('It\'s clear that Quirrell did not expect to see YOU here.');
        await showText('As he starts talking, you notice that his voice seems a lot different than before...\nIt\'s not his usual quivering treble, but rather cold and sharp.');
        await showText('Before you can do anything, Quirrell snaps his fingers: immediately, ropes sprang out of thin air and wrapped themselves tightly around you.');
        await showText('You nearly cannot believe, as he explains that he is going to steal the Philosophers\' Stone. He proceeds to examine the mirror.');
        await showText('Quirrell walks around the mirror, and you look into it.\nThere, you can see it: your reflection, smiling at you.');
        await showText('Inside the mirror, you see yourself put your hand into your pocket and pull out a blood-red stone.');
        await showText('After putting the Stone back in the pocket, you feel something heavy drop into the real one.');
    }
}

/**
 * Handles the failure ending of the Philosopher's Stone quest.
 */
export async function mainQuest_HospitalFailure(house: hogwartsHouseName): Promise<void>
{
    await showText('You wake up, a few days later, in the Hospital Wing.');
    await showText('As you open your eyes, you notice that there is only a person in the room.');
    await showText('It\'s the headmaster, who seems to be eating some candy from a bag on your bedside table.');
    await showText('Professor Dumbledore does not spend many words investigating why you were in the dungeon...');
    await showText('Just as you begin to wonder if he could read minds, he recognizes the qualities you have demonstrated.');
    await showText('Dumbledore awards 10 points to ' + house + '.');
}

/**
 * Handles the mid-year ending of the Philosopher's Stone quest.
 * @param house The mc's Hogwarts House.
 */
export async function mainQuest_MidYearEnding(house: hogwartsHouseName): Promise<void>
{
    await showText('You open the last door.');
    await showText('The room is empty, except for a big chest. You try to open it, but the chest remains closed.');
    await showText('Not a long after, Professor Dumbledore himself joins you into the chamber.');
    await showText('Even he seems stunned by your impressive feat.');
    await showText('After you both moved to his office, he listens to you telling about the trials you have just overcome.');
    await showText('When you\'re done talking, he smiles, and awards 50 points to ' + house + '.');
}

/**
 * Handles the good ending of the Philosopher's Stone quest.
 * @param house The mc's Hogwarts House.
 */
export async function mainQuest_GoodEnding(house: hogwartsHouseName): Promise<void>
{
    await showText('All the knowledge learned at school bears fruit, as you manage to keep your ground against Quirrell.');
    await showText('Suddenly, the HORROR on the back of the professor\'s head run away, leaving professor Quirrell collapsed on the ground.');
    await showText('Not a long after, Professor Dumbledore himself joins you into the chamber.');
    await showText('Just have just saved the whole school, and maybe more than that: even he seems stunned by your impressive feat.');
    await showText('After you both moved to his office, he listens to you telling about the trials you have just overcome.');
    await showText('Professor Dumbledore decides to reward you with a special commendation for the services rendered to the school of Hogwarts.');
    await showText('Also, he awards 50 points to ' + house + '.');
    await showText('The whole school murmurs of your feat, and you become quite popular among your peers!');
}

/**
 * Handles the bad ending of the Philosopher's Stone quest.
 * @param house The mc's Hogwarts House.
 */
export async function mainQuest_BadEnding(): Promise<void>
{
    await showText('Alas, you can do nothing against him.');
    await showText('Angry as you never saw him, Quirrell knocks you out with a mysterious spell.');
    await showText('You wake up, nearly a week later, in the Hospital Wing.');
    await showText('Professor Dumbledore is with you, and as he explains, Quirrell\'s spell might have damaged you.');
    await showText('Try as you might to remember, your recollections of the past few months are patchy.');
}

// #endregion MAIN QUEST TASKS