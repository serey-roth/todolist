# A Simple To-do List
A task organizer than runs on vanilla JavaScript, with Firebase user authentication and Firestore database.  

[Link](https://serey-roth.github.io/todolist/)

## Instructions
#### Main Panel
This is where individual tasks are displayed. Users can add new tasks by clicking the "Add task" button and sort by picking an option from the drop-down list.  

Each task card contains the title, due date, edit, delete and box icons. 
* Edit: allows you to edit the current task
* Delete: delete the current task
* Box: mark tasks as completed without deleting it from the main panel feed 
Clicking the card activates the detail panel which display the task in its entirety, including its description and priority.  

Clicking the "Add task" button generates a form in which the user must enter a title, due date and a priority for the task.
Task description and the project name, however, are optional. If a project is selected within the dashboard, the new task will then appear 
within that project's panel; otherwise, it will show up in the "All Tasks" panel.

#### Dashboard
Users can sign in or out by clicking respective buttons located at the top of the dashboard. Clicking the sign in button generates a form in which the user
must enter a valid email address and password. Furthermore, users can add new projects to the web application by clicking the "Add new project" button.  

Via the dashboard, users have access to various task categories:
* All Tasks: shows all tasks
* Today: filters for tasks due today
* This Week: filters for tasks due this week
* Projects: 
  * filters for project-related tasks
  
## Personal Notes
1st Version: 2022-07-08 -> 2022-07-13   
What I did:  
* Finish the first version of the HTML, CSS and Javascript files. 
* Incorporate Firebase user authentication and Firestore database.
* Set up Webpack for the app.

I integrated modular patterns and SOLID principles while building the first version of the application. I also had the chance to practice several
JS topics such as factory functions and IIFEs.   
<img width="1252" alt="Screen Shot 2022-07-24 at 1 57 51 PM" src="https://user-images.githubusercontent.com/88986106/180666376-1145ac2c-2175-43c0-b7e5-7475dfac3d78.png">
<img width="1249" alt="Screen Shot 2022-07-24 at 1 58 15 PM" src="https://user-images.githubusercontent.com/88986106/180666377-959a5322-f627-4415-8988-8be8b6c349b5.png">
<img width="1246" alt="Screen Shot 2022-07-24 at 1 58 32 PM" src="https://user-images.githubusercontent.com/88986106/180666379-30de0834-66d6-4afe-87b3-df9696e698c5.png">

2nd Version: 2022-07-17 -> 2022-07-22  
What I did:  
* Redo the UI to include a dashboard and a main panel.
* Rewrite the styling using Sass
* Compartmentalize the functionalities of the application into several modules

In addition to the tools that I used to build the first version, I integrated classes, modules and asynchronous functions into this version.   

3rd Version: TBD  
I plan on building this application using React.js and including advanced CSS animations. 
