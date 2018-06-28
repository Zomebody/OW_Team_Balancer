# OW Team Balancer

Introduction
------------
This is the source of a simple webpage tool that allows you to easily generate balanced Overwatch teams.

Features
--------
### Role balancing
The algorithm not only takes player ranks into consideration but also roles. When adding players you can choose what role you want them to fill. The algorithm prioritizes these roles over rank in order to maintain a healthy balance of roles. But fear not, the average ranks will still be as close to each other as possible!

### Algorithm modes
You can choose is what way you would like to balance teams.
* Best balance: Tries to find the teams with the smallest average SR difference.
* Quick find: Stops when it finds two teams that are within a few SR points difference.
* Inclusive find: Tries to include as many players not present in the previous teams.

### Easily add up to 24 players
Simply add players by filling in a name, rank and role on the menu to the right. You can also input a list of players by using the **Quick Add** button at the top right. The tool supports up to 24 players, meaning this is a perfect tool when you are playing pick-up games with more than 12 players!

### Simple edits on the fly
You can quickly enable or disable players by pressing the button to the left of their entry. Additionally, when you remove a player from the list, its data is added to the input fields. This makes it quick and easy to make changes to some player's data.

### Known issues
Inclusive find may ignore some players forever. This is usually the case with 5+ Flex players since an 'optimal' match will only include 1 Flex player on each team. Because of that, 3 Flex players are always marked as must-picks, however only 2 can be sorted into slots. A solution would be to fill in each slot's role depending on must-picks first when inclusive find is chosen.
