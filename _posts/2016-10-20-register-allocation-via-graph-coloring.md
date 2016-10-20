---
layout: post
title:  Register Allocation via Graph Coloring
date:   2016-10-20
author: Michael Meli
categories: algorithms
tags: [graph-problem, algorithms]
---
Optimizing compilers can generally be broken up into various stages: the front-end, the optimizer, and the back-end. The back-end is a vital element of the compiler as it translates the intermediate representation (IR) of the source program into machine-specific form in a process known as code generation. A major part of code generation is **register allocation**, which can be realized by determining a **approximating heuristic solution** to the **graph coloring problem**.

<i><center><img src="http://i.imgur.com/3CasL6C.png" alt="Peterson graph" /> <br/>Figure 1: The three major stages of a compiler.</center></i>

To understand the basis of the register allocation problem, one must first consider the previous stages of the compiler. The *Front End* of the compiler converts the source language program into a machine-independent intermediate representation (IR). This allows the *Middle End* of the compiler to easily perform the same optimizations across all source languages for all targets. In the IR representation of a source program, registers are used as the operands of instructions. Since IR is machine independent, and since it will make many optimizations significantly easier, the following assumption is made: "During optimization, assume an infinite set of registers; treat register allocation as a separate problem" [1]. In other words, the IR is assumed to have an infinite set of registers at its disposal, and the problem of register allocation will be deferred to the *Back End*. Obviously, however, this is a convenient assumption that does not hold in reality: real architectures do not have an infinite set of registers. The register allocation problem, then, is attempting to find an optimal mapping of the IR registers to limited physical registers on the target machine.

The unfortunate truth is that good register allocation is very difficult. Fortunately, "graph coloring offers a simplifying abstraction" [1]. The graph coloring problem is a **graph problem** that attempts to find an assignment of colors to each node in a graph such that no two adjacent nodes have the same color. More importantly, the search version of the graph coloring problem attempts to find an assignment of colors such that a graph can be colored with `k` colors. A graph that is colorable with `k` colors is said to be `k`-colorable.

<br/><i><center><img src="https://upload.wikimedia.org/wikipedia/commons/9/90/Petersen_graph_3-coloring.svg" alt="Petersen graph" /> <br/>Figure 2: A Petersen graph colored with 3 colors, which makes it 3-colorable.<br/>Image from <a href="https://commons.wikimedia.org/wiki/File:Petersen_graph_3-coloring.svg">Wikimedia Commons</a>.</center></i><br/>

The register allocation problem can be reduced to the graph coloring problem by creating an interference graph [1]. In such a graph, the live range of each register in the IR representation is represented by a node, and each edge represents interferences between live ranges. A live range is the period of time from when a register is defined to when it is last used. The reduction is relatively straightforward: if two live ranges are adjacent in the interference graph, "they are said to interfere and cannot occupy the same [physical] register. If the nodes in the graph can be colored in `k` or fewer colors, where any pair of nodes connected by an edge receive different colors and `k` is the number of registers available on the machine, then the coloring corresponds to an allocation" [1]. In other words, if the interference graph is `k`-colorable, where `k` is the number of target machine registers, then a perfect mapping of IR registers to physical registers is possible.

<br/><i><center><img src="http://i.imgur.com/3Gb3qK5.png" alt="Coloring interference graph" /> <br/>Figure 3: An example of how coloring an interference graph leads to register allocation.<br/>Image from <a href="http://www.lighterra.com/papers/graphcoloring/">Jason Robert Carey Patterson</a>.</center></i><br/>

Unfortunately, optimal graph coloring is unlikely to be practical because the problem of finding a k-coloring for some fixed `k > 3` has been shown to be **NP-complete** [2]. This is a major issue as the overwhelming majority of computer architectures have more than 3 registers. Proof that the graph coloring problem for `k > 3` is NP-hard can be achieved by reduction from the 3SAT problem, which is itself a reduction of the Boolean Satisfiability Problem (SAT) in which each clause of the boolean formula is limited to at most three literals [2]. Both the SAT and 3SAT problems are known to be NP-complete.

Since the register allocation problem will be NP-complete for essentially all architectures, compilers have to use a **heuristic algorithm** to attempt to search for a coloring [1]. Heuristic algorithms only find approximations of a solution and thus are not guaranteed to find the optimal coloring. Most relevant for a register allocator, "it is not guaranteed to find a `k`-coloring for all `k`-colorable graphs" [1]. On the other hand, heuristics can be developed that find a graph coloring in polynomial time. The first register allocator based on graph coloring was developed by Gregory Chaitin and his colleagues as part of the PL.8 compiler at IBM Research in 1982 [1]. Chaitin’s algorithm relies on the observation that if a graph is colorable with `k – 1` colors, then the same graph with one additional node can be colored with `k` colors. The actual algorithm is summarized below [1]:

<i><center><img src="http://i.imgur.com/fknuDUk.png" alt="Chaitin's algorithm" /></center></i>

The algorithm can be shown to run in polynomial time, and thus it is in **class P**. Specifically, the time complexity is `O(n + e)`, where `n` is the number of nodes to be colored and `e` is the number of edges in the interference graph. See Figure 4 for an example of this algorithm.

In conclusion, it is clear why the register allocation problem faced by optimizing compilers has been the focus of much research. The use of **graph coloring** significantly improves the resulting allocation. However, this algorithm is **NP-complete**, and thus a **heuristic algorithm** must be used to find a non-optimal solution.

<br/><i><center><img src="http://i.imgur.com/VADU0Tc.png" alt="Example algorithm" /> <br/>Figure 4: An example of Chaitlin's heuristic algorithm with k = 3<br/>Image from <a href="http://www.lighterra.com/papers/graphcoloring/">Jason Robert Carey Patterson</a>.</center></i>

### References
[1] [Briggs, Preston. *Register Allocation via Graph Coloring*. PhD thesis, Rice University, 1992.](http://www.cs.utexas.edu/users/mckinley/380C/lecs/briggs-thesis-1992.pdf)

[2] [Karp, Richard M. *Reducibility among combinatorial problems*. University of California at
Berkeley, 1972.](https://people.eecs.berkeley.edu/~luca/cs172/karp.pdf)
