# PyJs-news-Api

Using news api and python location tagger library to add stories(including their location) to news project db. Leveraging the power of child threads to run python from within JS!

In order to add a few stories to [open source news](https://opensourcenews.herokuapp.com/) this codes uses the news Api provided by https://newsapi.org/ to find stories. To add the locations of the stories
the python location logger library was used. The Geoapify reverse geocoding api is used to get the coordinates of the locations extracted from the articles.

The python code is run from within the javascript using the child_process API which let's us create child processes to run our code.
This child process can run code in many languages allowing us to run python from within javascript (more specifically from within NodeJs)!
