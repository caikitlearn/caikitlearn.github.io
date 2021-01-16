---
layout: post
title: Stirling's Pogs
excerpt: 1990s Spawn pogs, the multinimial distribution, and Stirling numbers of the second kind.
---


<!--==================================================-->
<!--   WHY ARE WE TALKING ABOUT POGS?                 -->
<!--==================================================-->
## Why are we talking about pogs?
The other day I was feeling nostalgic for my Québécois childhood and, on a whim, bought 21 packs of Spawn pogs from eBay. Each pack contains 1 kini (slammer) and 7 pogs (milk caps). To play, people take turns using a kini to slam a stack of pogs, or a stack of kinis ('kini-kini', as the kids used to say), and claim the ones that flip over. For this Spawn collection, there are a total of <a href='https://www.milkcapmania.co.uk/World-POG-Federation-WPF/Canada-Games/157-Spawn-Kinis.html' target='_blank'>8 unique kinis</a> and <a href='https://www.milkcapmania.co.uk/World-POG-Federation-WPF/Canada-Games/156-Spawn.html' target='_blank'>70 unique pogs</a> to collect.

<img src='/assets/images/mtl.jpeg' class='img-responsive'>
<p class='picture-caption'>simpler times</p>


<!--==================================================-->
<!--   WHAT'S THE PROBLEM?                            -->
<!--==================================================-->
## What's the problem?
Other than embarrassment, what came next was a series of seemingly simple and innocuous questions: assuming each kind of kini is equally likely to appear in a pack, what is the probability that I collect all 8 unique kinis from my 21 packs? How many packs would I need to buy to have a 90% chance of collecting all 8 unique kinis? What is the distribution of the number of unique kinis \\( K \\) out of a maximum of \\( M \\) that I get out of a known number of packs \\( n \\)? Over the course of my afternoon I became increasing obsessed with these problems.


<!--==================================================-->
<!--   APPROXIMATING THE SOLUTION                     -->
<!--==================================================-->
## Approximating the solution
A quick way to get an estimate for the desired probability is to simulate the opening of 21 packs by sampling 8 numbers with replacement 21 times:

```python
import numpy as np
def simulate_probability(k,n,M=8,R=10000,seed=64):
    np.random.seed(seed)
    return sum(len(set(np.random.choice(M,n)))==k for r in range(R))/R
>>> print('{0:.3f}'.format(simulate_probability(k=8,n=21)))
0.573
```
<div style="overflow: auto; width: auto"><table><tr><td><pre style="margin: 0; line-height: 125%"><span style="color: #8B008B; font-weight: bold">import</span> <span style="color: #008b45">numpy</span> <span style="color: #8B008B; font-weight: bold">as</span> <span style="color: #008b45">np</span>
<span style="color: #8B008B; font-weight: bold">def</span> <span style="color: #008b45">simulate_probability</span>(k,n,M=<span style="color: #B452CD">8</span>,R=<span style="color: #B452CD">10000</span>,seed=<span style="color: #B452CD">64</span>):
np.random.seed(seed)
<span style="color: #8B008B; font-weight: bold">return</span> <span style="color: #658b00">sum</span>(<span style="color: #658b00">len</span>(<span style="color: #658b00">set</span>(np.random.choice(M,n)))==k <span style="color: #8B008B; font-weight: bold">for</span> r <span style="color: #8B008B">in</span> <span style="color: #658b00">range</span>(R))/R
</pre></td></tr></table></div>
<div style="overflow: auto; width: auto"><table><tr><td><pre style="margin: 0; line-height: 125%; margin-bottom: 0.8em">&gt;&gt;&gt; <span style="color: #658b00">print</span>(<span style="color: #CD5555">&#39;{0:.3f}&#39;</span>.format(simulate_probability(k=<span style="color: #B452CD">8</span>,n=<span style="color: #B452CD">21</span>)))
<span style="color: #B452CD">0.573</span>
</pre></td></tr></table></div>
<p>
    Equivalently, we can view this setup as a multinomial distribution where we roll an 8-sided die 21 times, and want to know the probability that we get at least 1 success for each of the 8 sides, or
</p>
\\[
    \mathbb{P}\left(X_{1}\geq1,\dots,X_{8}\geq 1\right)\textrm{ for }\left(X_{1},\dots,X_{8}\right)\sim\textrm{Multinomial}\left(n=21,p_{j}=\frac{1}{8}\textrm{ for }j\in\left\{ 1,\dots,8\right\} \right)
\\]
<p>
    This exact probability is difficult to determine by hand. The arrangement of 8 kinds of kinis over 21 packs is neither a permutation nor a combination, but rather a Cartesian product with 8<sup>21</sup> equally likely possibilities, where each possibility can be represented as a 21-tuple. For large values of <i>n</i>, even a computer would take a long time adding up all the individual tuples satisfying our desired outcome (at least 1 of each kind of kini). We can instead simulate draws of the multinomial distribution to estimate our desired probability:
</p>
<div style="overflow: auto; width: auto"><table><tr><td><pre style="margin: 0; line-height: 125%"><span style="color: #8B008B; font-weight: bold">def</span> <span style="color: #008b45">simulate_multinomial_probability</span>(k,n,M=<span style="color: #B452CD">8</span>,R=<span style="color: #B452CD">10000</span>,seed=<span style="color: #B452CD">64</span>):
np.random.seed(seed)
samples=np.random.multinomial(n,[<span style="color: #B452CD">1</span>/M]*M,size=R)
<span style="color: #8B008B; font-weight: bold">return</span> np.mean(np.sum(samples&gt;=<span style="color: #B452CD">1</span>,axis=<span style="color: #B452CD">1</span>)==k)
</pre></td></tr></table></div>
<div style="overflow: auto; width: auto"><table><tr><td><pre style="margin: 0; line-height: 125%; margin-bottom: 0.8em">&gt;&gt;&gt; <span style="color: #658b00">print</span>(<span style="color: #CD5555">&#39;{0:.3f}&#39;</span>.format(simulate_multinomial_probability(k=<span style="color: #B452CD">8</span>,n=<span style="color: #B452CD">21</span>)))
<span style="color: #B452CD">0.579</span>
</pre></td></tr></table></div>
<p>
    There are some interesting papers on approximating the multinomial distribution (Johnson, 1960; Deheuvels & Pfeifer, 1988), but these will not be the focus of this post.
</p>
<!--==================================================-->
<!--   AN EXACT SOLUTION                              -->
<!--==================================================-->
<h2>An exact solution</h2>
<p>
    Under the assumptions, there are a total of 8<sup>21</sup> or 9,223,372,036,854,775,808 equally likely possibilities. Solving this problem boils down to counting the number of possibilities that contain all 8 unique kinis, which turned out to be quite difficult to do. Of course, this is quite easy to brute force with a computer, but would run at O(<i>8</i><sup><i>n</i></sup>), which is far too slow. We can still use the brute force method to check the accuracy of our approximations for smaller values of <i>n</i> and <i>M</i>:
</p>
<div style="overflow: auto; width: auto"><table><tr><td><pre style="margin: 0; line-height: 125%"><span style="color: #8B008B; font-weight: bold">import</span> <span style="color: #008b45">itertools</span>
<span style="color: #8B008B; font-weight: bold">def</span> <span style="color: #008b45">brute_probability</span>(k,n,M=<span style="color: #B452CD">8</span>):
<span style="color: #8B008B; font-weight: bold">return</span> <span style="color: #658b00">sum</span>(<span style="color: #658b00">len</span>(<span style="color: #658b00">set</span>(p))==k <span style="color: #8B008B; font-weight: bold">for</span> p <span style="color: #8B008B">in</span> itertools.product(<span style="color: #658b00">range</span>(M),repeat=n))/M**n
</pre></td></tr></table></div>
<div style="overflow: auto; width: auto"><table><tr><td><pre style="margin: 0; line-height: 125%">&gt;&gt;&gt; <span style="color: #658b00">print</span>(brute_probability(k=<span style="color: #B452CD">4</span>,n=<span style="color: #B452CD">6</span>,M=<span style="color: #B452CD">4</span>))
<span style="color: #B452CD">0.380859375</span>
</pre></td></tr></table></div>
<div style="overflow: auto; width: auto"><table><tr><td><pre style="margin: 0; line-height: 125%">&gt;&gt;&gt; <span style="color: #658b00">print</span>(<span style="color: #CD5555">&#39;{0:.3f}&#39;</span>.format(simulate_probability(k=<span style="color: #B452CD">4</span>,n=<span style="color: #B452CD">6</span>,M=<span style="color: #B452CD">4</span>)))
<span style="color: #B452CD">0.378</span>
</pre></td></tr></table></div>
<div style="overflow: auto; width: auto"><table><tr><td><pre style="margin: 0; line-height: 125%; margin-bottom: 0.8em">&gt;&gt;&gt; <span style="color: #658b00">print</span>(<span style="color: #CD5555">&#39;{0:.3f}&#39;</span>.format(simulate_multinomial_probability(k=<span style="color: #B452CD">4</span>,n=<span style="color: #B452CD">6</span>,M=<span style="color: #B452CD">4</span>)))
<span style="color: #B452CD">0.380</span>
</pre></td></tr></table></div>
<p>
    Fortunately, the approximations are very close to the real value.
</p>

<!--==================================================-->
<!--   A FASTER EXACT SOLUTION                        -->
<!--==================================================-->
<h2>A faster exact solution</h2>
<p>
    Intuitively, the brute force method is inefficient because it considers every single possible 21-tuple. We can be smart about counting these tuples to come up with a faster solution; this is the part that required some creative thinking. After discussing the problem with my friend <a href='https://calebhmiles.github.io/' target='_blank'>Caleb</a>, we arrived at a formal solution.
</p>
<p>
    For brevity, consider a simpler case with 4 unique kinis (labeled ABCD for convenience), and 6 packs to open. To begin, start with the 4<sup>6</sup> total tuples, and subtract away the ones where we do not collect all 4 kinds of kinis.
</p>
<ul>
    <p>
        <li>
            <p>
                Step 1: try to subtract tuples where we collect at most 3 of the 4 unique kinis.
            </p>
            <p>
                We have \({4 \choose 3}\) ways of choosing the 3 kinis that we receive, and for each choice, there are a total of 3<sup>6</sup> tuples. However, the answer isn't just \(4^{6}-{4 \choose 3}3^{6}\) because that double subtracts some tuples. For example, the tuple AAAAAA is subtracted once when the 3 chosen kinis are ABC, and again when the 3 chosen kinis are ABD, and again when the 3 chosen kinis are ACD. Similarly, the tuple ABABAB is subtracted once when the 3 chosen kinis are ABC, and again when the 3 chosen kinis are ABD. The only tuples that are not double subtracted are those that contain <i>exactly</i> 3 of the 4 unique kinis.
            </p>
        </li>
    </p>
    <p>
        <li>
            <p>
                Step 2: try to add back duplicate tuples where we collect at most 2 of the 4 unique kinis.
            </p>
            <p>
                We have \({4 \choose 2}\) ways of choosing the 2 kinis that we receive, and for each choice, there are a total of 2<sup>6</sup> tuples. However, the answer isn't just \(4^{6}-{4 \choose 3}3^{6}+{4 \choose 2}2^{6}\) because now we have double added some tuples back. For example, the tuple AAAAAA is added back when the choice of the 2 kinis are AB, and again when the choice of the 2 kinis are AC, and again when the choice of the 2 kinis are AD. The net effect is that we have not subtracted 6-of-a-kind tuples like AAAAAA at all. This time, the only tuples that are not double added are those that contain <i>exactly</i> 2 of the 4 unique kinis.
            </p>
        </li>
    </p>
    <p>
        <li>
            <p>
                Step 3: try to subtract duplicate tuples where we collect exactly 1 of the 4 unique kinis.
            </p>
            <p>
                Here we only have 4 tuples to subtract: AAAAAA, BBBBBB, CCCCCC, and DDDDDD. These are tuples that were subtracted in Step 1 and re-added in Step 2, and thus still need to be subtracted from the total. The final answer is \(4^{6}-{4 \choose 3}3^{6}+{4 \choose 2}2^{6}-4=1560\)
                tuples where we collect all 4 unique kinis (out of 4096 possibilities). This ratio is 0.380859375, as verified by the brute force solution.
            </p>
        </li>
    </p>
</ul>
<p>
    More generally, the number of tuples containing <i>k</i> unique kinis out of <i>n</i> packs is
    \[
        T\left(n,k\right)=\sum_{j=0}^{k}\left(-1\right)^{k-j}{k \choose j}j^{n},k=1,\dots,M
    \]
    This is much faster to run than the brute force method:
</p>
<div style="overflow: auto; width: auto"><table><tr><td><pre style="margin: 0; line-height: 125%"><span style="color: #8B008B; font-weight: bold">from</span> <span style="color: #008b45">scipy.special</span> <span style="color: #8B008B; font-weight: bold">import</span> comb
<span style="color: #8B008B; font-weight: bold">def</span> <span style="color: #008b45">stirling</span>(k,n):
<span style="color: #8B008B; font-weight: bold">return</span> <span style="color: #658b00">sum</span>((-<span style="color: #B452CD">1</span>)**(k-j)*comb(k,j,exact=<span style="color: #658b00">True</span>)*(j**n) <span style="color: #8B008B; font-weight: bold">for</span> j <span style="color: #8B008B">in</span> <span style="color: #658b00">range</span>(k+<span style="color: #B452CD">1</span>))
</pre></td></tr></table></div>
<div style="overflow: auto; width: auto"><table><tr><td><pre style="margin: 0; line-height: 125%">&gt;&gt;&gt; stirling(k=<span style="color: #B452CD">4</span>,n=<span style="color: #B452CD">6</span>)
<span style="color: #B452CD">1560</span>
</pre></td></tr></table></div>
<div style="overflow: auto; width: auto"><table><tr><td><pre style="margin: 0; line-height: 125%">&gt;&gt;&gt; stirling(k=<span style="color: #B452CD">8</span>,n=<span style="color: #B452CD">21</span>)
<span style="color: #B452CD">5342844138794426880</span>
</pre></td></tr></table></div>
<div style="overflow: auto; width: auto"><table><tr><td><pre style="margin: 0; line-height: 125%; margin-bottom: 0.8em">&gt;&gt;&gt; stirling(k=<span style="color: #B452CD">8</span>,n=<span style="color: #B452CD">21</span>)/<span style="color: #B452CD">8</span>**<span style="color: #B452CD">21</span>
<span style="color: #B452CD">0.5792723222532361</span>
</pre></td></tr></table></div>
<p>
    The exact probability I was seeking is
\[
    \frac{5,342,844,138,794,426,880}{9,223,372,036,854,775,808}\doteq0.579
\]
This is pretty close to the simulated probabilities shown earlier. To answer my other question, I would have needed 33 packs to ensure a 90% chance of collecting all 8 kinds of kinis:
</p>
<div style="overflow: auto; width: auto"><table><tr><td><pre style="margin: 0; line-height: 125%; margin-bottom: 0.8em">&gt;&gt;&gt; stirling(k=<span style="color: #B452CD">8</span>,n=<span style="color: #B452CD">33</span>)/<span style="color: #B452CD">8</span>**<span style="color: #B452CD">33</span>
<span style="color: #B452CD">0.904520364249363</span>
</pre></td></tr></table></div>

<!--==================================================-->
<!--   WHO IS STIRLING?                               -->
<!--==================================================-->
<h2>Who is Stirling?</h2>
<p>
    As it turns out, these numbers have a special name, called <a href='http://mathworld.wolfram.com/StirlingNumberoftheSecondKind.html' target='_blank'>Stirling Numbers of the Second Kind</a>, which is the number of ways to partition <i>n</i> elements into <i>k</i> non-empty sets, defined as
    \[
        S\left(n,k\right)=\frac{1}{k!}\sum_{j=0}^{k}\left(-1\right)^{k-j}{k \choose j}j^{n}=\frac{1}{k!}\sum_{j=0}^{k}\left(-1\right)^{j}{k \choose j}\left(k-j\right)^{n}=\frac{1}{k!}T\left(n,k\right)
    \]
    The numbers are named after James Stirling, a mathematician from the 18th century. The above formula is different from the one we derived by a factorial term, since Stirling did not care about ordering when he partitioned numbers into sets. In our example we want to preserve the order because we are considering all <i>M</i><sup><i>n</i></sup> possibilities as equally likely.
</p>

<!--==================================================-->
<!--   SO HOW DID I DO?                               -->
<!--==================================================-->
<h2>So how did I do?</h2>
<p>
    I ended up with only 7 of the 8 types of kinis. Was I unlucky? We can use our exact solution to find the probability of getting <i>k</i> kinds of kinis from 21 packs as
    \[
        \mathbb{P}\left(K=k|n=21,M=8\right)={M \choose k}\frac{T\left(n,k\right)}{M^{n}},k=1,\dots,M
    \]
    \[
        \begin{align*}
            \mathbb{P}\left(K=8|n=21,M=8\right) & =0.579\\
            \mathbb{P}\left(K=7|n=21,M=8\right) & =0.360\\
            \mathbb{P}\left(K=6|n=21,M=8\right) & =0.058\\
            \mathbb{P}\left(K=5|n=21,M=8\right) & =0.003\\
            \mathbb{P}\left(K\leq4|n=21,M=8\right) & \doteq0.000
        \end{align*}
    \]
    So I was mildly unlucky and missed out on the 4th kini (see below). An exact test would show insufficient evidence to reject the null hypothesis that the 8 kinis are equally likely to appear in a pack.
</p>
<img src='{{url_for('static',filename='images/kinis.jpg')}}' class='img-responsive' style='display: block; margin-top: 25px; margin-bottom: 10px; margin-left: auto; margin-right: auto; width: 50%; height: auto; min-width: 300px;'>
<p style='font-size: 12px; margin-bottom: 25px' align='center'>there are different colours and colour patterns for each kini ... this changes everything</p>

<!--==================================================-->
<!--   FINAL THOUGHTS                                 -->
<!--==================================================-->
<h2>Final thoughts</h2>
<p>
    Much to the dismay of my fiancée, I ended up buying an extensive collection of the Spawn kinis and pogs from someone else on eBay to (mostly) complete the collection, as it was essentially the same price as buying 10 more individual packs. This whole experience was a great nostalgia fix for me, in more ways than one. While Stirling's numbers of the second kind might be an introductory concept taught in undergraduate combinatorics courses, they reminded me of the good old days of high school math contest problems, and I was genuinely happy and excited to be talking about this novel (to me) problem. Tying in together some simple probability and statistics was just gravy. Special thanks again to Caleb for putting off his revisions to discuss the problem with me, finding out the link to Stirling, and encouraging this blog post.
</p>

<br><br>
<p style='font-size: 12px; text-align: center;'><i>Updated 2019-01-26</i></p>
