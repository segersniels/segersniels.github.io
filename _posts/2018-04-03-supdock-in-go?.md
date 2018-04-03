---
layout: post
title: Supdock in Go?
---

There is a new kid on the block and it's called Golang. Golang has been around for quite a while but has recently risen in popularity again. Mainly because more and more people seem to realise that the single threaded `node.js` performance is underwhelming for high performance tools and applications.

As I mainly spend my days inside a terminal, I have a ton of utilities that assist me during the day. One of them is my tool [`supdock`](https://github.com/segersniels/supdock) that I use as an assisting tool that wraps around the basic docker command (`alias docker="supdock"`).

I also have a running container count in my prompt. Which basically executes a docker command every time the prompt get redrawn. In combination with the alias this results in the docker command being executed through `node` which slows down the process quite a bit with it's single threaded performance. My prompt was getting noticeable slower.

So I rewrote `supdock` in Go ([`supdock-go`](https://github.com/segersniels/supdock-go)) to see how much of a difference in performance there actually is.

{% highlight bash %}
supdock ps  0.33s user 0.07s system 103% cpu 0.390 total
supdock-go ps  0.06s user 0.02s system 91% cpu 0.091 total
{% endhighlight %}

We can clearly see that Go is the winner over Node here. I guess I'll have to keep this in mind whenever I see the need to write a new tool.
