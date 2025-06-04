---
layout: post
title: "Pokemon Showdown Replays"
date: 2025-06-02
permalink: /posts/pokemon-showdown-replays
excerpt: "Fetching and parsing Pokemon Showdown replays using their API."
---

## My Poke-Journey
If you know even a little bit about me, you know that I love Pokemon. I remember when Red/Blue came out in 1998, and watching other kids play the games on the playground because I didn't have my own. My friend eventually lent me Red, where Squirtle and I got stuck in Mt. Moon before returning the game. I gave $1 to a different friend (in retrospect, perhaps an enemy) so he would tell me where to buy the official trading cards, not the [knock-offs from Chinatown](https://www.elitefourum.com/t/remember-these/16434) that were stickers in disguise. After that, I collected for a while until I devastatingly lost a bunch of them at Chinese school. Most notably, I remember pulling a Ninetales, fleecing a classmate in a trade for his Alakazam, and then getting fleeced in return a short while later. We didn't have cable so I had to rent episodes of the TV series on VHS, and for my birthday one year my mom accidentally rented Digimon, even though she [asked the clerk](https://frinkiac.com/caption/S07E11/1299731) for the best episodes.

After we moved to Melbourne, I was promised a Game Boy if I got into this [Acceleration Program](https://aus.edutest.com.au/Parent/Info?s=u28JV9HtcPG09Nw%2Bbuq8DQ%3D%3D), and ended up with the Neotones Ice GBC and Pokemon Yellow (even though Gold/Silver/Crystal was already out). I promised to limit playing to 30 minutes a day - a promise that was repeatedly broken from day 1. My interested in Pokemon waned a little after that, and didn't pick up again until I discovered [Netbattle](https://bulbapedia.bulbagarden.net/wiki/Pok%C3%A9mon_NetBattle) in 2006 or so, where I played challenge cup, and all generations of OU (1 to 4 at the time). Fast forward to 2021, and I re-discover competitive battling during COVID, this time in the form of Pokemon Showdown. I play a lot of randbats before re-discovering gen 3 OU through the videos of [Jimothy Cool](https://www.youtube.com/user/jimothycool), and this brings us to the topic of this post.

## Ok nerd, what are you trying to do?


## Getting the data
There are a lot of historical replays on Pokemon Showdown, which can be directly scraped with their [API](https://github.com/smogon/pokemon-showdown-client/blob/master/WEB-API.md). I first scraped past replay IDs, then found the corresponding replays and parsed their logs, yielding the following columns:
- Player 1 name and ELO
- Player 2 name and ELO
- Player 1 lead Pokemon
- Player 2 lead Pokemon
- Player 1 team (revealed Pokemon and moves)
- Player 2 team (revealed Pokemon and moves)
- Match winner
- Player 1 lucky turns (critical hits, secondary effects, opponent misses)
- Player 2 lucky turns (critical hits, secondary effects, opponent misses)