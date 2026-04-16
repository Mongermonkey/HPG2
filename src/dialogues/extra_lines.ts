
import { showText } from "../utilities/_index";
import { MainChara, hogwartsHouse } from "../basis/_index";

/**
 * Handles each year's arrival at Hogwarts.
 */
export async function arrivalAtHogwarts(year: number): Promise<void>
{
    if (year === 1)
    {
        await showText('On the first of September, you board the Hogwarts Express from platform nine and three-quarters at King\'s Cross Station.');
        await showText('By the same evening, you arrive at the magnificent and mysterious Hogwarts Castle.');
        await showText('In the Great Hall, under a velvety black ceiling dotted with stars, the Sorting Ceremony is about to begin...');
        await showText('Everyone seems very excited about it.');
        await showText('The Sorting Hat is brought in, looking old and worn.\nHe presents the four houses: Gryffindor, Hufflepuff, Ravenclaw and Slytherin.');
        await showText('After a while, the Sorting Hat is placed on your head. It feels a bit heavy and itchy.');
        await showText('"...Hmmmm... Interesting... Very interesting...", the hat recites.');
    }
    else
    {
        await showText('On the first of September, you board the Hogwarts Express from platform nine and three-quarters at King\'s Cross Station.');
        await showText('By the same evening, you arrive at the Hogwarts Castle: you have missed the place during summer.');
        await showText('Another year at Hogwarts is about to start, and you can\'t wait to see what it has in store for you.');
    }
}

/**
 * Handles the end-of-year feast and the house cup ceremony.
 * @param first The house in first place.
 * @param second The house in second place.
 * @param third The house in third place.
 * @param fourth The house in fourth place.
 */
export async function eoyFeast(chara: MainChara<'Wizard'>, first: hogwartsHouse, second: hogwartsHouse, third: hogwartsHouse, fourth: hogwartsHouse): Promise<void>
{
    await showText('The night of the end-of-year feast finally arrives.\nAll the students are waiting for the house cup award.');
    await showText('In fourth and last place, there is ' + fourth.name + ', with ' + fourth.points + ' points.');
    await showText('In third place, there is ' + third.name + ', with ' + third.points + ' points.');
    await showText('In second place, there is ' + second.name + ', with ' + second.points + ' points.');
    await showText('And finally, in first place, there is ' + first.name + ', with ' + first.points + ' points.');
    await showText(first.name + ' wins the house cup!');
    if (first.name === chara.house) await showText('Your house\'s table erupts in cheers, and you can\'t help but feel proud of your housemates.');
    else await showText('The feast starts, and you can\'t help but feel a bit sad that the year is coming to an end.');
}

/**
 * Handles the discovery of the Room of Requirement.
 */
export async function roomOfRequirementDiscovery(name: string): Promise<void>
{
    await showText('While wandering in the castle, you find a door that wasn\'t there before.');
    await showText('You open it, and it leads you to a room that seems to be exactly what you need at that moment.');
    await showText('You\'ve done it ' + name + ', you found the Room of Requirement!');
    await showText('You spend some time in the room, and you find it very useful for your needs.');
}

/**
 * Handles the metamorph outcome of a Peeves' prank.
 * @param foeName The name of the targeted student.
 * @param deeds Whether the mc partecipated in the prank or not.
 */
export async function metamorphPrank(foeName: string, deeds: boolean)
{
    await showText('You successfully metamorph into ' + foeName + ', before running away.');
    await showText('You manage to escape from Filch, who now consider ' + foeName + ' responsible for ' + (deeds ? 'your deeds.' : 'Peeves\' doing.'));
    await showText('In the next days, you hear students gossiping about you.');
}

/**
 * Handles the effects of taking the Wolfsbane potion.
 * @param param The result of the Wolfsbane potion decision. It can be either "No harm" or the name of the student attacked.
 */
export async function takeWolfsBane(param?: string)
{
    if (!param)
    {
        await showText('Once again, it\'s THAT time of the month.');
        await showText('You should take the wolfsbane potion to prevent the transformation.');
    }
    else if (param === 'No harm')
    {
        await showText('Luckily, in the night of the full moon, no one is injured, and you get away with it.');
        await showText('The transformation is exhausting though, and leaves you without energy for the next week.');
    }
    else
    {
        await showText('In your werewolf form, you attack ' + param + ', causing them serious harm.');
        await showText('You spend the week after the transformation exhausted and regretful.');
    }
}

/**
 * Handles the encounter with Aragog in the Dark Forest.
 * @param chara The main character.
 * @param buddy The name of the companion.
 */
export async function DarkForest_Aragog(chara: MainChara<'Wizard'>, buddy: string)
{    
    await showText('For nearly half an hour, you walk through the woods. Both you and ' + buddy + ' collect some unicorn hair.');
    await showText('As you walk deeper and deeper into the forest the path becomes harder to follow, due to the large number of spider webs.');
    await showText('At some point, ' + buddy + ' notice something moving behind the trees...');
    await showText('You then hear something above you two. And before you can turn back, you find yourself surrounded by giant spiders.');
    await showText('Suddenly, both of you get caught and lift up in the branches by the spiders. They look monstrous.');
    await showText('The spiders then take you to a misty dome web in the center of a cavity, from where emerges a spider the size of a small elephant.');

    await showText('Horrified and paralized by fear, you see that the giant spider is blind... And you hear the thing talk.');
    await showText('As it turns out, the giant spider is Aragog, an \'acromantula\' that professes to be Hagrid\'s friend.');
    await showText('The fleble hope that just raised in your heart is quickly crushed by Aragog\'s words, describing you as food for his children.');
    await showText('But soon you hear another, more familiar voice: it\'s Hagrid, who has come to rescue you two.');
    await showText('Still trembling from what you witness, the two of you slowly make your way back to Hagrid\'s hut, where you can recover.');
    await showText('Neither you nor ' + buddy + ' can ever forget this night.');
}

/**
 * Handles the half-giant bullying at Hogwarts.
 * @param slytherin Whether the character is in Slytherin house.
 * @param yearOne Whether the character is in their first year.
 */
export async function giantRacism(slytherin: boolean, yearOne: boolean)
{
    await showText((yearOne ? 'Once again, due' : 'Due') + ' to your giant blood, you are often the target of bullying from other students.');
    if (yearOne) await showText('Some stupid kid has made it a thing to try new spells on you for fun, knowing that they will have little to no effect.');
    if (slytherin) await showText('Your housemates are the worst' + (yearOne ? ', since they have access to your bedroom and can easily mess with your stuff.' : ''));
    await showText('Hogwarts can be a cruel place for a half-giant, and you often feel like an outcast.');
}