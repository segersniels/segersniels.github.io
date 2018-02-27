---
layout: post
title: View running docker containers in ZSH prompt
---

I find it oddly amusing to see how many docker container I have running on my prompt while working.

First you'll have to create the following function in your `.zshrc` file. Which basically just gets the count of containers in your `docker ps`.

{% highlight bash %}
function docker_prompt () {
  docker ps -q |wc -l |tr -d ' '
}
{% endhighlight %}

Then you proceed to insert this `docker_prompt` function in your `PROMPT`. As I'm using the `oh-my-zsh` theme called *sorin* I went to edit `~/.oh-my-zsh/themes/sorin.zsh-theme`.

{% highlight bash %}
PROMPT='%{$fg[red]%}containers:(%{$fg[blue]%}$(docker_prompt)%{$fg[red]%}) %{$fg[cyan]%}%c$(git_prompt_info) %(!.%{$fg_bold[red]%}#.%{$fg_bold[green]%}❯)%{$reset_color%} '
{% endhighlight %}

Et voila, your prompt now shows your running container count!

{% highlight bash %}
containers:(0) ~ ❯
{% endhighlight %}
