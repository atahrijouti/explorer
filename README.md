# Explorer
An adventure down mount JavaScript. And what an adventure.

---

## Background

Once upon a time, @VincentHoorpah gave me a task to as part of the recruitment process for a full-stack position at his firm. ([a copy can be found here](https://github.com/abderrahmane-tj/file-manager)

The task was to make a Windows Explorer inspired app with functional folder navigation, upload of files and a working back-end. The task which seemingly small from the description, held many architectural challenges such as how to model the data to represent a folder structure, or how to manage state and history. I had done the task in 3.5 days, with one component holding logic and render parts that would usually be split into multiple small parts if one values their sanity. Basically, something you would write when doing a hackathon. Low quality, high pretend. 

When I had submitted the github repository to my previous employer, I've always known that time would come when I would go back to it and do it again, if only for the sake of doing a better job at thinking about it and following proper procedures.

Here we are.

## Foreground

In this repository, @AmineTir and I are usually pair-programming and discussing ideas on how to implement a Windows Explorer inspired Directory Navigator, Explorer thingy type thing what-cha-ma-call-it.

We have opted to start with nothing but Vanilla JavaScript. Once the project started to look like something, we started feeling the need for types. Then came TypeScript, and lo and behold, magic types at your fingertips!

Then came refactoring, refactoring again, then yet another refactor. Each time was a different reason. After the project started to look like something and we had file and folder creation working, but were reaching across files to update state in different files, we started seeing a pattern. For example : directly and imperatively reaching outside your own jurisdiction feeds the spaghetti troll and leads to several unhandled scenarios. Thus, one of the refactors was to try and make the application more reactive. Another refactor was to completely remove html from html files and render entire document from JavaScript. As any maturing project, many iterations affect many things in a project, and since this particular project is about learning and deciding on better approaches while we go forward, I wouldn't be surprised if even more changes happen again.

This sure is a weird Readme, and it too will probably see some refactoring ;-P
