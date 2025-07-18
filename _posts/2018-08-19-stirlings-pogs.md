---
layout: post
title: "Stirling's Pogs"
date: 2018-08-19
permalink: /posts/stirlings-pogs
excerpt: "1990s Spawn pogs, the multinomial distribution, and Stirling numbers of the second kind."
---
## Why are we talking about pogs?

The other day I was feeling nostalgic for my Québécois childhood and, on a whim, bought 21 packs of Spawn pogs from eBay. Each pack comes with 1 kini (slammer) and 7 pogs (milk caps). To play, people take turns using a kini to slam a face-down stack of pogs, or a stack of kinis ('kini-kini', as the kids used to say), and win any that flip up. For this Spawn collection, there are <a href='https://www.milkcapmania.co.uk/World-POG-Federation-WPF/Canada-Games/157-Spawn-Kinis.html'>8 unique kinis</a> and <a href='https://www.milkcapmania.co.uk/World-POG-Federation-WPF/Canada-Games/156-Spawn.html'>70 unique pogs</a> to collect.

<figure style="text-align: center;">
  <img src="/assets/images/2018-08-19-stirlings-pogs/mtl.jpg" style="max-width: 75%;">
  <figcaption>simpler times</figcaption>
</figure>

<br>
## What's the problem?

Other than embarrassment, what came next was a series of seemingly simple and innocuous questions:
- Assuming each of the 8 kinis is equally likely to appear in a pack, what is the probability that I collect all 8 unique kinis from my 21 packs?
- How many packs would I need to buy to have a 90% chance of collecting all 8 unique kinis?
- What is the distribution of the number of unique kinis $K$ (out of a maximum of $M$) that I get out of a known number of packs $n$?

Over the course of my afternoon I became increasingly obsessed with these problems.

<br>
## Approximating the solution

A quick way to get an estimate for the desired probability is to simulate the opening of 21 packs by sampling 8 numbers with replacement 21 times:

```python
import numpy as np


def simulate_probability(k, n, M=8, R=10000, seed=64):
  np.random.seed(seed)
  return sum(len(set(np.random.choice(M, n))) == k for r in range(R)) / R


>>> print(f"{simulate_probability(k=8, n=21):.4f}")
0.5729
```

Equivalently, we can view this setup as a multinomial distribution where we roll an 8-sided die 21 times, and want to know the probability that we get at least 1 success for each of the 8 sides, or

<div class='math-display'>
$$
\Pr\left( X_1 \geq 1,\ X_2 \geq 1,\ \dots,\ X_8 \geq 1 \right)
$$
</div>

for

<div class='math-display'>
$$
(X_1, \dots, X_8) \sim \mathrm{Multinomial}\left( n = 21,\ p_j = \frac{1}{8}, j = 1,\dots,8 \right)
$$
</div>

This exact probability is difficult to determine by hand. The arrangement of 8 kinds of kinis over 21 packs is neither a permutation nor a combination, but rather a Cartesian product with $8^{21}$ equally likely possibilities, where each possibility can be represented as a 21-tuple. For large values of $n$, even a computer would take a long time adding up all the individual tuples satisfying our desired outcome (at least 1 of each kind of kini). We can instead simulate draws of the multinomial distribution to estimate our desired probability:

```python
def simulate_multinomial_probability(k, n, M=8, R=10000, seed=64):
  np.random.seed(seed)
  samples = np.random.multinomial(n, [1 / M] * M, size=R)
  return np.mean(np.sum(samples >= 1, axis=1) == k)


>>> print(f"{simulate_multinomial_probability(k=8, n=21):.4f}")
0.5790
```

There are some interesting papers on approximating the multinomial distribution (Johnson, 1960; Deheuvels & Pfeifer, 1988), but these will not be the focus of this post.

<br>
## An exact solution

Under the assumptions, there are a total of $8^{21}$ or 9,223,372,036,854,775,808 equally likely possibilities. Solving this problem boils down to counting the number of possibilities that contain all 8 unique kinis, which turned out to be quite difficult to do. Of course, this is quite easy to brute force with a computer, but would run at $O(8^{n})$, which is far too slow. We can still use the brute force method to check the accuracy of our approximations for smaller values of $n$ and $M$:

```python
import itertools


def brute_probability(k, n, M=8):
    return sum(len(set(p)) == k for p in itertools.product(range(M), repeat=n)) / M**n


>>> print(f"{brute_probability(k=4, n=6, M=4):.4f}")
0.3809

>>> print('{0:.3f}'.format(simulate_probability(k=4, n=6, M=4)))
0.3777

>>> print(f"{simulate_multinomial_probability(k=4, n=6, M=4):.4f}")
0.3804
```

Fortunately, the approximations are very close to the real value.

<br>
## A faster exact solution

Intuitively, the brute force method is inefficient because it considers every single possible 21-tuple. We can be smart about counting these tuples to come up with a faster solution; this is the part that required some creative thinking. Thanks to a discussion with Professor <a href='https://calebhmiles.github.io/'>Caleb Miles</a>, we arrived at a formal solution.

For brevity, consider a simpler case with 4 unique kinis (labeled ABCD for convenience), and 6 packs to open. To begin, start with the $4^{6}$ total tuples, and subtract away the ones where we do not collect all 4 kinds of kinis.

- Step 1: try to subtract tuples where we collect at most 3 of the 4 unique kinis.

We have ${4 \choose 3}$ ways of choosing the 3 kinis that we receive, and for each choice, there are a total of $3^{6}$ tuples. However, the answer isn't just $4^{6}-{4 \choose 3}3^{6}$ because that double subtracts some tuples. For example, the tuple AAAAAA is subtracted once when the 3 chosen kinis are ABC, and again when the 3 chosen kinis are ABD, and again when the 3 chosen kinis are ACD. Similarly, the tuple ABABAB is subtracted once when the 3 chosen kinis are ABC, and again when the 3 chosen kinis are ABD. The only tuples that are not double subtracted are those that contain *exactly* 3 of the 4 unique kinis.

- Step 2: try to add back duplicate tuples where we collect at most 2 of the 4 unique kinis.

We have ${4 \choose 2}$ ways of choosing the 2 kinis that we receive, and for each choice, there are a total of $2^{6}$ tuples. However, the answer isn't just $4^{6}-{4 \choose 3}3^{6}+{4 \choose 2}2^{6}$ because now we have double added some tuples back. For example, the tuple AAAAAA is added back when the choice of the 2 kinis are AB, and again when the choice of the 2 kinis are AC, and again when the choice of the 2 kinis are AD. The net effect is that we have not subtracted 6-of-a-kind tuples like AAAAAA at all. This time, the only tuples that are not double added are those that contain *exactly* 2 of the 4 unique kinis.

- Step 3: try to subtract duplicate tuples where we collect exactly 1 of the 4 unique kinis.

Here we only have 4 tuples to subtract: AAAAAA, BBBBBB, CCCCCC, and DDDDDD. These are tuples that were subtracted in Step 1 and re-added in Step 2, and thus still need to be subtracted from the total. The final answer is $4^{6}-{4 \choose 3}3^{6}+{4 \choose 2}2^{6}-4=1560$ tuples where we collect all 4 unique kinis (out of 4096 possibilities). This ratio is 0.380859375, as verified by the brute force solution.

More generally, the number of tuples containing $k$ unique kinis out of $n$ packs is

<div class='math-display'>
$$
  T\left(n,k\right)=\sum_{j=0}^{k}\left(-1\right)^{k-j}{k \choose j}j^{n},k=1,\dots,M
$$
</div>

This is much faster to run than the brute force method:

```python
from scipy.special import comb


def stirling(k, n):
    return sum(
        (-1) ** (k - j) * comb(k, j, exact=True) * (j**n) for j in range(k + 1)
    )

>>> stirling(k=4, n=6)
1560

>>> stirling(k=8, n=21)
5342844138794426880

>>> print(f"{stirling(k=8, n=21) / 8**21:.4f}")
0.5793
```

The exact probability I was seeking is

<div class='math-display'>
$$
  \frac{5,342,844,138,794,426,880}{9,223,372,036,854,775,808}\doteq0.579
$$
</div>

This is pretty close to the simulated probabilities shown earlier. To answer my other question, I would have needed 33 packs to ensure a 90% chance of collecting all 8 kinds of kinis:

```python
>>> print(f"{stirling(k=8, n=33) / 8**33:.4f}")
0.9045
```

<br>
## Who is Stirling?

As it turns out, these numbers have a special name, called <a href='http://mathworld.wolfram.com/StirlingNumberoftheSecondKind.html'>Stirling Numbers of the Second Kind</a>, which is the number of ways to partition $n$ elements into $k$ non-empty sets, defined as

<div class='math-display'>
$$
  \begin{align*}
    S(n, k) &= \frac{1}{k!} \sum_{j=0}^{k} (-1)^{k-j} \binom{k}{j} j^n \\
            &= \frac{1}{k!} \sum_{j=0}^{k} (-1)^j \binom{k}{j} (k-j)^n \\
            &= \frac{1}{k!} T(n, k)
\end{align*}
$$
</div>

The numbers are named after James Stirling, a mathematician from the 18th century. The above formula is different from the one we derived by a factorial term, since Stirling did not care about ordering when he partitioned numbers into sets. In our example we want to preserve the order because we are considering all $M^{n}$ possibilities as equally likely.

<br>
## So how did I do?

I ended up with only 7 of the 8 types of kinis. Was I unlucky? We can use our exact solution to find the probability of getting <i>k</i> kinds of kinis from 21 packs as

<div class='math-display'>
$$
  \Pr\left(K=k|n=21,M=8\right)={M \choose k}\frac{T\left(n,k\right)}{M^{n}},k=1,\dots,M
$$
</div>

<div class='math-display'>
$$
  \begin{align*}
    \Pr\left(K=8 \mid n=21,M=8\right) & =0.579\\
    \Pr\left(K=7 \mid n=21,M=8\right) & =0.360\\
    \Pr\left(K=6 \mid n=21,M=8\right) & =0.058\\
    \Pr\left(K=5 \mid n=21,M=8\right) & =0.003\\
    \Pr\left(K\leq4 \mid n=21,M=8\right) & \doteq0.000
  \end{align*}
$$
</div>

So I was mildly unlucky and missed out on the 4th kini (see below). An exact test would show insufficient evidence to reject the null hypothesis that the 8 kinis are equally likely to appear in a pack.

<figure style="text-align: center;">
  <img src="/assets/images/2018-08-19-stirlings-pogs/kinis.jpg" style="max-width: 75%;">
  <figcaption>there are different colors and color patterns for each kini... this changes everything</figcaption>
</figure>

<br>
## Final thoughts

Much to the dismay of my fiancée, I ended up buying an extensive collection of the Spawn kinis and pogs from someone else on eBay to (mostly) complete the collection, as it was essentially the same price as buying 10 more individual packs. This whole experience was a great nostalgia fix for me, in more ways than one. While Stirling's numbers of the second kind might be an introductory concept taught in undergraduate combinatorics courses, they reminded me of the good old days of high school math contest problems, and I was genuinely happy and excited to be talking about this novel (to me) problem. Tying in together some simple probability and statistics was just gravy. Special thanks again to Caleb for putting off his revisions to discuss the problem with me, finding out the link to Stirling, and encouraging this blog post.