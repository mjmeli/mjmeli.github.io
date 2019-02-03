---
layout: post
title:  Research Paper Accepted to Top-Tier Security Conference NDSS 2019
date:   2018-12-02
author: Michael Meli
categories: research
tags: [academic, research, paper, security, github, secret, leakage, measurement, ndss]
---

I'm excited to announce that my paper, ***How Bad Can It Git? Characterizing Secret Leakage in Public GitHub Repositories***, has been accepted into NDSS 2019. NDSS, The Network and Distributed System Security Symposium, is considered to be one of the top tier of academic security conferences in the world. Our research focused on performing the first comprehensive, rigorous, and longitundial of secret leakage on the popular open-source repository site GitHub.

Our research focused on the measurement and analysis of secret leakage in public GitHub repositories. In the software development world, the use of public APIs is extremely prevalent. To integrate to an API, a developer usually requires some sort of private credentials for authentication and authorization, similar to a password. While this is a standard and well-established step, problems can arise with this practice in the open-source community. Open-source code, such as that published on the popular site GitHub, is intended to be shared with the wider internet; clearly, this is not a conducive environment for keeping credentials, which are required for proper functionality of the code in question, private. In many cases, these private credentials, which we called secrets, can end up being published on the open internet and are vulnerable to being stolen and abused. In our paper, we worked to perform the first comprehensive, rigorous, and longitundial study on GitHub to determine the extent of secret leakage. After demonstrating a high-efficiency attack to retrieve hundreds of thousands of credentials, we analyzed our unique dataset to provide valuable insights into the state of open-source credential (mis)management.

The paper has not yet been finalized, but once it has, I will post a copy of it on this site. Until then, I'm excited to see our paper presented to this gathering of distinguished researchers in Feburary 2019.
