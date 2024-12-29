import fs from 'fs';
import { Command } from 'commander';
import chalk from 'chalk';

const program = new Command();

program
  .name('todo-manager')
  .description('Can add tasks, display pending tasks, and mark tasks as complete')
  .version('1.0.0');

program
  .option('-a, --add <task>', 'Add a new task')
  .option('-d, --display', 'Displays all the pending tasks')
  .option('-c, --complete <task>', 'Check the task which is completed')
  .action((options) => {
    if (options.add) {
      const taskDescription = options.add;
      
      fs.readFile("files.json", "utf-8", (err, data) => {
        if (err) {
          console.log(chalk.blue.bgRed.bold("Error Occurred: in reading"));
          return;
        }

        let todos = [];
        todos = JSON.parse(data);
        
        const newTask = {
          id: todos.length > 0 ? todos[todos.length - 1].id + 1 : 1,
          todo: taskDescription,
          time: new Date().toISOString(),
          completed: false,
        };

        todos.push(newTask);
        fs.writeFile("files.json", JSON.stringify(todos, null, 2), 'utf-8', (err) => {
          if (err) {
            console.log(chalk.blue.bgRed.bold("Error Occurred: in writing"));
          } else {
            console.log(chalk.bgGreen.bold(`Task added successfully: ${taskDescription}`));
          }
        });
      });
    } else if(options.display) {
      fs.readFile("files.json", "utf-8", (err, data) => {
        if (err) {
          console.log(chalk.blue.bgRed.bold("Error Occurred: in reading"));
          return;
        }

        let todos = [];
        todos = JSON.parse(data);
        if(todos.length === 0) {
          console.log(
            chalk.bgRed.white.bold('🚫 No Tasks Found! 🚫') +
            '\n' +
            chalk.redBright.bold('Your task list is empty. 📝') +
            '\n' +
            chalk.yellowBright.italic('Start adding some tasks to stay productive! 💡 Use ') +
            chalk.cyanBright.bold('todo -a "<your task>"') +
            chalk.yellowBright.italic(' to add a new task.')
          );
        }

        let allComp = true;

        for(let i = 0; i < todos.length; i++) {
          if(todos[i].completed) {
            continue;
          } else {
            allComp = false;
            console.log(chalk.bgCyan('-', todos[i].todo));
          }
        }

        if(allComp) {
          console.log(
            chalk.bgGreen.black.bold('🎉 Congratulations! 🎉') +
            '\n' +
            chalk.greenBright.bold('You have completed all your tasks! 🚀') +
            '\n' +
            chalk.yellowBright.italic('Take a moment to celebrate your productivity and keep up the amazing work! 💪')
          );
        }
      });
    } else if(options.complete) {
      const taskDescription = options.complete;
      
      fs.readFile("files.json", "utf-8", (err, data) => {
        if (err) {
          console.log(chalk.blue.bgRed.bold("Error Occurred: in reading"));
          return;
        }

        let todos = [];
        todos = JSON.parse(data);
        let check = false;

        for(let i = 0; i < todos.length; i++) {
          if(todos[i].todo == taskDescription) {
            todos[i].completed = true;
            check = true;
            console.log(
              chalk.bgGreen.black.bold('✅ Task Marked as Completed! ✅') +
              '\n' +
              chalk.greenBright.bold('Congratulations on finishing a task! 🎉') +
              '\n' +
              chalk.cyanBright.italic('Keep up the great work and tackle the next one! 💪') +
              '\n' +
              chalk.yellowBright('Completed Task: ') +
              chalk.whiteBright.bold(taskDescription)
            );
          }
        }

        if(!check) {
          console.log(
            chalk.bgRed.white.bold('⚠️ Task Not Found! ⚠️') +
            '\n' +
            chalk.redBright.bold('Oops! The task you are trying to mark as completed does not exist. 🚫') +
            '\n' +
            chalk.yellowBright.italic('It seems like you haven’t added this task yet. 💡') +
            '\n' +
            chalk.greenBright('Use ') +
            chalk.cyanBright.bold('todo -a "<your task>"') +
            chalk.greenBright(' to add a new task first! ✅')
          );
        }  else {
          // Write the updated todos array back to the file
          fs.writeFile("files.json", JSON.stringify(todos, null, 2), "utf-8", (err) => {
            if (err) {
              console.log(chalk.blue.bgRed.bold("Error Occurred: in writing"));
            } else {
              console.log(chalk.green.bold("Task list updated successfully!"));
            }
          });
        }
      });
    } else {
      console.log(
        chalk.bgYellow.black.bold('⚠️ Invalid Option! ⚠️') +
        '\n' +
        chalk.redBright.bold('Hmm... That doesn’t seem like a valid command. 🤔') +
        '\n' +
        chalk.greenBright('Here’s what you can do:') +
        '\n' +
        chalk.cyanBright('  - Use ') +
        chalk.yellowBright.bold('todo -a "<task>"') +
        chalk.cyanBright(' to add a task.') +
        '\n' +
        chalk.cyanBright('  - Use ') +
        chalk.yellowBright.bold('todo -d') +
        chalk.cyanBright(' to display all pending tasks.') +
        '\n' +
        chalk.cyanBright('  - Use ') +
        chalk.yellowBright.bold('todo -c <taskId>') +
        chalk.cyanBright(' to mark a task as completed.') +
        '\n' +
        chalk.magentaBright.bold('Need help? Remember to stay awesome and try again! ✨')
      );
    }
  });

program.parse(process.argv); 